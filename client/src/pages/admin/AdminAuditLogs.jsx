import React, { useState, useEffect } from 'react';
import { Shield, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../../utils/api.js';

export const AdminAuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admin/audit-logs');
        if (res.success) setLogs(res.logs || []);
      } catch (e) {
        console.warn('Audit logs error:', e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-stone-200">
        <h1 className="text-2xl font-black text-stone-900 tracking-tight">System Audit &amp; Security Logs</h1>
        <p className="text-xs text-stone-500">Immutable trails for financial rule deployments, product edits, and order interventions</p>
      </div>

      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-premium-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase text-[10px]">
            <tr>
              <th className="py-3 px-4">Action</th>
              <th className="py-3 px-4">Performed By</th>
              <th className="py-3 px-4">Target Type</th>
              <th className="py-3 px-4">Details</th>
              <th className="py-3 px-4">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 font-medium">
            {logs.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-8 text-center text-stone-400">No audit log entries recorded yet.</td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log._id} className="hover:bg-stone-50/60 transition-colors">
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded text-[11px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-stone-800">
                    {log.performedByName} <span className="text-[10px] text-stone-400">({log.role})</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-stone-600 uppercase text-[10px]">
                      {log.targetType}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-stone-500 max-w-xs truncate text-[11px]">
                    {JSON.stringify(log.details || {})}
                  </td>
                  <td className="py-3 px-4 text-stone-400 text-[11px]">
                    {new Date(log.timestamp).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAuditLogs;
