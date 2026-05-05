'use client';

import { useEffect, useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { Transaction } from '@/types';
import { getTransactions, deleteTransaction } from '@/services/transactionService';
import { apiService } from '@/lib/apiService';
import api from '@/services/api';
import TransactionList from '@/components/TransactionList';

const MONTHS = [
  '', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

interface ImportResult {
  inserted: number;
  updated: number;
  errors: string[];
}

export default function Historico() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function load() {
    setLoading(true);
    apiService
      .getCached(
        `transactions:${month}:${year}`,
        () => getTransactions(month, year),
        (fresh) => setTransactions(fresh),
      )
      .then(setTransactions)
      .finally(() => setLoading(false));
  }

  useEffect(() => { load(); }, [month, year]);

  async function handleDelete(id: string) {
    await deleteTransaction(id);
    apiService.invalidatePattern('transactions:');
    apiService.invalidatePattern('dashboard:');
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }

  async function handleExport() {
    setExporting(true);
    try {
      const res = await api.get('/transactions/export', { responseType: 'blob' });
      const url = URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `radar-gastos-${new Date().toISOString().slice(0, 10)}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  }

  async function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setImportResult(null);
    try {
      const buffer = await file.arrayBuffer();
      const wb = XLSX.read(buffer, { type: 'array' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws);

      const rows = raw.map((r) => ({
        id:          String(r['ID (não edite)'] ?? '').trim() || undefined,
        date:        String(r['Data'] ?? '').trim(),
        description: String(r['Descrição'] ?? '').trim(),
        category:    String(r['Categoria'] ?? '').trim(),
        type:        String(r['Tipo'] ?? '').trim(),
        amount:      Number(r['Valor (R$)']),
      }));

      const { data } = await api.post<ImportResult>('/transactions/import', { rows });
      setImportResult(data);

      if (data.inserted > 0 || data.updated > 0) {
        apiService.invalidatePattern('transactions:');
        apiService.invalidatePattern('dashboard:');
        load();
      }
    } catch {
      setImportResult({ inserted: 0, updated: 0, errors: ['Erro ao processar o arquivo.'] });
    } finally {
      setImporting(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  function prevMonth() {
    if (month === 1) { setMonth(12); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  }
  function nextMonth() {
    if (month === 12) { setMonth(1); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  }

  return (
    <div className="flex flex-col gap-5 pb-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Histórico</h2>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            {exporting ? '⏳' : '⬇'} Exportar
          </button>
          <button
            onClick={() => fileRef.current?.click()}
            disabled={importing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            {importing ? '⏳' : '⬆'} Importar
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".xlsx"
            className="hidden"
            onChange={handleImportFile}
          />
        </div>
      </div>

      {importResult && (
        <div className={`rounded-xl border px-4 py-3 text-sm ${importResult.errors.length > 0 && importResult.inserted + importResult.updated === 0 ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-slate-900 border-slate-700'}`}>
          <p className="font-semibold text-white mb-1">Resultado da importação</p>
          {importResult.inserted > 0 && (
            <p className="text-green-400">✓ {importResult.inserted} {importResult.inserted === 1 ? 'transação inserida' : 'transações inseridas'}</p>
          )}
          {importResult.updated > 0 && (
            <p className="text-blue-400">✓ {importResult.updated} {importResult.updated === 1 ? 'transação atualizada' : 'transações atualizadas'}</p>
          )}
          {importResult.errors.map((e, i) => (
            <p key={i} className="text-red-400">✕ {e}</p>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <button onClick={prevMonth} className="text-slate-400 hover:text-white px-2 py-1">‹</button>
        <span className="text-white font-semibold">{MONTHS[month]} {year}</span>
        <button onClick={nextMonth} className="text-slate-400 hover:text-white px-2 py-1">›</button>
      </div>

      {loading ? (
        <p className="text-center py-10 text-slate-500">Carregando...</p>
      ) : (
        <TransactionList transactions={transactions} onDelete={handleDelete} />
      )}
    </div>
  );
}
