import Product from '../models/Product.js';
import Category from '../models/Category.js';
import AuditLog from '../models/AuditLog.js';

export const getProducts = async (req, res, next) => {
  try {
    const { category, search, minPrice, maxPrice, sort, groupOnly } = req.query;
    const query = {};

    if (category) {
      const catObj = await Category.findOne({ $or: [{ slug: category }, { name: category }] });
      if (catObj) {
        query.category = catObj._id;
      }
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (groupOnly === 'true') {
      query.isGroupBuyEligible = true;
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    if (sort === 'price_desc') sortOption = { price: -1 };
    if (sort === 'rating') sortOption = { ratings: -1 };
    if (sort === 'popular') sortOption = { activeGroupsCount: -1 };

    const products = await Product.find(query).sort(sortOption).populate('category', 'name slug');
    res.json({ success: true, count: products.length, products });
  } catch (error) {
    next(error);
  }
};

export const getProductByIdOrSlug = async (req, res, next) => {
  try {
    const { id } = req.params;
    let product;

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(id).populate('category', 'name slug');
    } else {
      product = await Product.findOne({ slug: id }).populate('category', 'name slug');
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ productCount: -1 });
    res.json({ success: true, count: categories.length, categories });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const productData = req.body;
    if (!productData.slug) {
      productData.slug = productData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }
    if (!productData.sku) {
      productData.sku = 'SKU-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    }

    const product = await Product.create(productData);

    // Increment category count
    if (product.category) {
      await Category.findByIdAndUpdate(product.category, { $inc: { productCount: 1 } });
    }

    await AuditLog.create({
      action: 'PRODUCT_CREATED',
      performedBy: req.user._id,
      performedByName: req.user.name,
      role: req.user.role,
      targetType: 'PRODUCT',
      targetId: product._id.toString(),
      details: { title: product.title, price: product.price }
    });

    res.status(201).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await AuditLog.create({
      action: 'PRODUCT_UPDATED',
      performedBy: req.user._id,
      performedByName: req.user.name,
      role: req.user.role,
      targetType: 'PRODUCT',
      targetId: product._id.toString(),
      details: { updatedFields: Object.keys(req.body) }
    });

    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await AuditLog.create({
      action: 'PRODUCT_DELETED',
      performedBy: req.user._id,
      performedByName: req.user.name,
      role: req.user.role,
      targetType: 'PRODUCT',
      targetId: req.params.id,
      details: { title: product.title }
    });

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};
