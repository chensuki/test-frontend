import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import type { Project, Timesheet } from '../api/client';

export default function Timesheets() {
  const [timesheets, setTimesheets] = useState<Timesheet[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  const [projectId, setProjectId] = useState<number | ''>('');
  const [workDate, setWorkDate] = useState<string>('');
  const [hours, setHours] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const canSubmit = useMemo(() => {
    return projectId !== '' && workDate && Number(hours) > 0;
  }, [projectId, workDate, hours]);

  async function load() {
    const [tsRes, prjRes] = await Promise.all([
      api.get<Timesheet[]>('/timesheets'),
      api.get<Project[]>('/projects'),
    ]);
    setTimesheets(tsRes.data);
    setProjects(prjRes.data);
  }

  useEffect(() => {
    load();
  }, []);

  async function addTimesheet(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    await api.post<Timesheet>('/timesheets', {
      projectId: projectId as number,
      workDate,
      hours: Number(hours),
      notes,
    });
    setProjectId('');
    setWorkDate('');
    setHours('');
    setNotes('');
    await load();
  }

  async function remove(id: number) {
    await api.delete(`/timesheets/${id}`);
    await load();
  }

  return (
    <div className="card">
      <h2 style={{ marginTop: 0, marginBottom: 12 }}>工时管理</h2>
      <form onSubmit={addTimesheet}>
        <div className="form-row">
          <select value={projectId} onChange={e => setProjectId(e.target.value ? Number(e.target.value) : '')}>
            <option value="">选择项目</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <input type="date" value={workDate} onChange={e => setWorkDate(e.target.value)} />
          <input type="number" step="0.1" placeholder="小时" value={hours} onChange={e => setHours(e.target.value)} style={{ width: 120 }} />
          <input placeholder="备注（可选）" value={notes} onChange={e => setNotes(e.target.value)} style={{ flex: '1 1 260px' }} />
          <button className="btn btn-primary" type="submit" disabled={!canSubmit}>新增工时</button>
        </div>
      </form>

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>项目</th>
            <th>日期</th>
            <th>小时</th>
            <th>备注</th>
            <th style={{ width: 90 }}>操作</th>
          </tr>
        </thead>
        <tbody>
          {timesheets.map(t => (
            <tr key={t.id}>
              <td>{t.id}</td>
              <td>{t.project?.name}</td>
              <td>{t.workDate}</td>
              <td>{t.hours}</td>
              <td>{t.notes}</td>
              <td><button className="btn btn-danger" onClick={() => t.id && remove(t.id)}>删除</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
