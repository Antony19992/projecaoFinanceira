'use client';

import { useEffect, useState } from 'react';
import { Caixinha, CreateCaixinhaDTO } from '@/types';
import { getCaixinhas, createCaixinha, updateCaixinha, deleteCaixinha } from '@/services/caixinhaService';
import { formatCurrency } from '@/lib/financeRadar';

const EMPTY_FORM: CreateCaixinhaDTO = {
  name: '',
  description: '',
  targetValue: 0,
  monthlyContribution: 0,
};

export default function CaixinhasPage() {
  const [caixinhas, setCaixinhas] = useState<Caixinha[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CreateCaixinhaDTO>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getCaixinhas().then(setCaixinhas).finally(() => setLoading(false));
  }, []);

  function startEdit(c: Caixinha) {
    setEditingId(c.id);
    setForm({
      name: c.name,
      description: c.description,
      targetValue: c.targetValue,
      monthlyContribution: c.monthlyContribution,
    });
    setShowForm(true);
  }

  function cancelForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        const updated = await updateCaixinha(editingId, form);
        setCaixinhas((prev) => prev.map((c) => (c.id === editingId ? updated : c)));
      } else {
        const created = await createCaixinha(form);
        setCaixinhas((prev) => [...prev, created]);
      }
      cancelForm();
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Deletar esta caixinha?')) return;
    await deleteCaixinha(id);
    setCaixinhas((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div className="flex flex-col gap-5 pb-6">
      <div className="flex items-center justify-between">
        <h2 className="text-white font-bold text-lg">Caixinhas</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm px-4 py-2 rounded-lg transition-colors"
          >
            + Nova
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-slate-800 rounded-xl p-4 flex flex-col gap-3">
          <p className="text-white font-semibold text-sm">
            {editingId ? 'Editar caixinha' : 'Nova caixinha'}
          </p>

          <input
            required
            placeholder="Nome (ex: Reserva de emergência)"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            className="bg-slate-700 text-white text-sm rounded-lg px-3 py-2 placeholder:text-slate-500 outline-none"
          />
          <textarea
            required
            placeholder="Descrição (onde está sendo guardado, objetivo...)"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={2}
            className="bg-slate-700 text-white text-sm rounded-lg px-3 py-2 placeholder:text-slate-500 outline-none resize-none"
          />
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-400">Valor alvo (R$)</label>
              <input
                required
                type="number"
                min="1"
                step="0.01"
                value={form.targetValue || ''}
                onChange={(e) => setForm((f) => ({ ...f, targetValue: Number(e.target.value) }))}
                className="bg-slate-700 text-white text-sm rounded-lg px-3 py-2 outline-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-400">Contribuição mensal (R$)</label>
              <input
                required
                type="number"
                min="1"
                step="0.01"
                value={form.monthlyContribution || ''}
                onChange={(e) =>
                  setForm((f) => ({ ...f, monthlyContribution: Number(e.target.value) }))
                }
                className="bg-slate-700 text-white text-sm rounded-lg px-3 py-2 outline-none"
              />
            </div>
          </div>

          {form.targetValue > 0 && form.monthlyContribution > 0 && (
            <p className="text-xs text-slate-400">
              Previsão: {Math.ceil(form.targetValue / form.monthlyContribution)} meses para atingir
              a meta
            </p>
          )}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-sm py-2 rounded-lg transition-colors"
            >
              {saving ? 'Salvando...' : editingId ? 'Salvar' : 'Criar'}
            </button>
            <button
              type="button"
              onClick={cancelForm}
              className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm py-2 rounded-lg transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {loading && (
        <div className="text-center py-16 text-slate-500">Carregando...</div>
      )}

      {!loading && caixinhas.length === 0 && !showForm && (
        <div className="text-center py-16 text-slate-500 text-sm">
          Nenhuma caixinha criada ainda.
        </div>
      )}

      {caixinhas.map((c) => {
        const now = new Date();
        const startDate = new Date(c.createdAt);
        const elapsedMonths = Math.max(
          1,
          (now.getFullYear() - startDate.getFullYear()) * 12 +
            (now.getMonth() - startDate.getMonth()) + 1,
        );
        const missedMonths = c.checkIns.length;
        const savedMonths = Math.max(0, elapsedMonths - missedMonths);
        const extrasTotal = c.extras.reduce((sum, e) => sum + e.amount, 0);
        const totalSaved = savedMonths * c.monthlyContribution + extrasTotal;
        const progress = Math.min(100, (totalSaved / c.targetValue) * 100);
        const monthsTotal = Math.ceil(c.targetValue / c.monthlyContribution);
        const monthsLeft = Math.max(0, Math.ceil((c.targetValue - totalSaved) / c.monthlyContribution));
        const isComplete = totalSaved >= c.targetValue;

        return (
          <div key={c.id} className="bg-slate-800 rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm">{c.name}</p>
                <p className="text-slate-400 text-xs mt-0.5">{c.description}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => startEdit(c)}
                  className="text-slate-400 hover:text-white text-xs"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="text-red-400 hover:text-red-300 text-xs"
                >
                  Deletar
                </button>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-1.5">
                <span>{formatCurrency(totalSaved)} guardados</span>
                <span>Meta: {formatCurrency(c.targetValue)}</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-slate-700/50 rounded-lg py-2">
                <p className="text-white text-sm font-semibold">{formatCurrency(c.monthlyContribution)}</p>
                <p className="text-slate-500 text-xs">por mês</p>
              </div>
              <div className="bg-slate-700/50 rounded-lg py-2">
                <p className="text-white text-sm font-semibold">{monthsTotal}</p>
                <p className="text-slate-500 text-xs">meses totais</p>
              </div>
              <div className="bg-slate-700/50 rounded-lg py-2">
                <p className={`text-sm font-semibold ${isComplete ? 'text-emerald-400' : 'text-white'}`}>
                  {isComplete ? 'Concluída!' : monthsLeft}
                </p>
                <p className="text-slate-500 text-xs">{isComplete ? '' : 'meses restantes'}</p>
              </div>
            </div>

            <p className="text-xs text-slate-500 text-center">
              {savedMonths} de {monthsTotal} meses guardados
              {missedMonths > 0 && (
                <span className="text-red-400"> · {missedMonths} {missedMonths === 1 ? 'mês perdido' : 'meses perdidos'}</span>
              )}
            </p>
          </div>
        );
      })}
    </div>
  );
}
