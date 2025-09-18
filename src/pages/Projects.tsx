import { useEffect, useState } from 'react';
import { api } from '../api/client';
import type { Project } from '../api/client';

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await api.get<Project[]>('/projects');
      setProjects(res.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function addProject(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    await api.post<Project>('/projects', { name, description });
    setName('');
    setDescription('');
    await load();
  }

  async function remove(id: number) {
    await api.delete(`/projects/${id}`);
    await load();
  }

  return (
    <div className="card">
      <h2 style={{ marginTop: 0, marginBottom: 12 }}>项目管理</h2>
      <form onSubmit={addProject}>
        <div className="form-row">
          <input
            placeholder="项目名称"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <input
            placeholder="描述（可选）"
            value={description}
            onChange={e => setDescription(e.target.value)}
            style={{ flex: '1 1 260px' }}
          />
          <button className="btn btn-primary" type="submit">新增项目</button>
        </div>
      </form>

      {loading ? (
        <div>加载中...</div>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>名称</th>
              <th>描述</th>
              <th style={{ width: 90 }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {projects.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{p.description}</td>
                <td>
                  <button className="btn btn-danger" onClick={() => p.id && remove(p.id)}>删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
