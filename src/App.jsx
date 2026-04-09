import React, { useState, useEffect } from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend 
} from 'recharts';
import { 
  LayoutDashboard, UserCircle, GraduationCap, ChevronLeft, 
  Plus, LogOut, Menu, X, ClipboardList, Info, CheckCircle2, 
  AlertCircle, XCircle, UserMinus, UserPlus, Trash2, Edit,
  Printer, CheckCheck
} from 'lucide-react';

// --- CONFIGURAÇÕES E DADOS INICIAIS ---
const PROFESSORES = ["Joseliza", "Lucas Kobos", "Amanda"];
const ANOS = ["1º Ano", "2º Ano", "3º Ano"];
const STATUS_OPTIONS = [
  { id: 'completa', label: 'Completa', color: '#10B981', icon: <CheckCircle2 size={16}/> },
  { id: 'incompleta', label: 'Incompleta', color: '#F59E0B', icon: <AlertCircle size={16}/> },
  { id: 'naofez', label: 'Não fez', color: '#EF4444', icon: <XCircle size={16}/> },
  { id: 'faltou', label: 'Faltou', color: '#6B7280', icon: <UserMinus size={16}/> },
];

const MOCK_ALUNOS_POR_TURMA = {
  "1º Ano": [
    { id: 1, nome: "Ana Beatriz" },
    { id: 2, nome: "Bruno Gomes" },
  ],
  "2º Ano": [
    { id: 3, nome: "Carlos Eduardo" },
    { id: 4, nome: "Daniela Costa" },
  ],
  "3º Ano": [
    { id: 5, nome: "Eduardo Felipe" },
  ]
};

const MOCK_TAREFAS = [];

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

// --- COMPONENTES DE INTERFACE ---

export default function App() {
  // MEMÓRIA DE LOGIN
  const [user, setUser] = useState(() => {
    return localStorage.getItem('pueri_logado') === 'true';
  });

  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // DADOS SALVOS (LOCAL STORAGE)
  const [alunosList, setAlunosList] = useState(() => {
    const saved = localStorage.getItem('pueri_alunos');
    return saved ? JSON.parse(saved) : MOCK_ALUNOS_POR_TURMA;
  });
  
  const [tarefasList, setTarefasList] = useState(() => {
    const saved = localStorage.getItem('pueri_tarefas');
    return saved ? JSON.parse(saved) : MOCK_TAREFAS;
  });

  useEffect(() => {
    localStorage.setItem('pueri_alunos', JSON.stringify(alunosList));
  }, [alunosList]);

  useEffect(() => {
    localStorage.setItem('pueri_tarefas', JSON.stringify(tarefasList));
  }, [tarefasList]);

  const handleLoginStatus = (status) => {
    setUser(status);
    if (status) {
      localStorage.setItem('pueri_logado', 'true');
    } else {
      localStorage.removeItem('pueri_logado');
    }
  };

  if (!user) {
    return <LoginPage onLogin={() => handleLoginStatus(true)} />;
  }

  const navigateTo = (page, year = null, teacher = null, task = null) => {
    setCurrentPage(page);
    setSelectedYear(year);
    setSelectedTeacher(teacher);
    setSelectedTask(task);
    setSidebarOpen(false);
  };

  const handleAddAluno = (year, novoAluno) => {
    setAlunosList(prev => ({ ...prev, [year]: [...(prev[year] || []), novoAluno] }));
  };

  const handleDeleteAluno = (year, alunoId) => {
    setAlunosList(prev => ({ ...prev, [year]: prev[year].filter(aluno => aluno.id !== alunoId) }));
  };

  const handleSaveTask = (taskData) => {
    if (taskData.id) {
      setTarefasList(prev => prev.map(t => t.id === taskData.id ? taskData : t));
    } else {
      setTarefasList(prev => [...prev, { ...taskData, id: Date.now() }]);
    }
    navigateTo('teacher', selectedYear, selectedTeacher);
  };

  const handleDeleteTask = (taskId) => {
    setTarefasList(prev => prev.filter(t => t.id !== taskId));
    navigateTo('teacher', selectedYear, selectedTeacher);
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-50 transform transition-transform lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center justify-between">
          <h1 className="text-xl font-bold text-blue-600 flex items-center gap-2">
            <GraduationCap /> Pueri Control
          </h1>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)}><X /></button>
        </div>
        
        <nav className="px-4 space-y-1">
          <NavItem active={currentPage === 'dashboard'} onClick={() => navigateTo('dashboard')} icon={<LayoutDashboard size={20}/>} label="Dashboard Geral" />
          <div className="pt-4 pb-2 px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Turmas</div>
          {ANOS.map(ano => (
            <NavItem key={ano} active={selectedYear === ano && currentPage !== 'dashboard'} onClick={() => navigateTo('class', ano)} icon={<GraduationCap size={20}/>} label={ano} />
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600">
            <UserCircle size={20} />
            <span className="truncate">adm_pueri</span>
          </div>
          <button onClick={() => handleLoginStatus(false)} className="w-full mt-2 flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition">
            <LogOut size={20} /> Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 justify-between lg:px-8">
          <button className="lg:hidden p-2" onClick={() => setSidebarOpen(true)}><Menu /></button>
          
          <div className="flex items-center gap-2 text-sm text-gray-500 overflow-hidden">
            <span className="hidden sm:inline hover:text-blue-600 cursor-pointer" onClick={() => navigateTo('dashboard')}>Início</span>
            {selectedYear && (
              <>
                <span className="mx-1">/</span>
                <span className={`truncate ${!selectedTeacher ? 'font-semibold text-gray-900' : 'hidden sm:inline'}`} onClick={() => navigateTo('class', selectedYear)}>{selectedYear}</span>
              </>
            )}
            {selectedTeacher && (
              <>
                <span className="mx-1">/</span>
                <span className="truncate font-semibold text-gray-900">{selectedTeacher}</span>
              </>
            )}
          </div>

          {currentPage !== 'dashboard' && (
            <button 
              onClick={() => currentPage === 'task-form' ? navigateTo('teacher', selectedYear, selectedTeacher) : navigateTo('class', selectedYear)}
              className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              <ChevronLeft size={18} /> <span className="hidden sm:inline">Voltar</span>
            </button>
          )}
        </header>

        <section className="flex-1 overflow-y-auto p-4 lg:p-8">
          {currentPage === 'dashboard' && <DashboardView tarefas={tarefasList} />}
          
          {currentPage === 'class' && 
            <ClassView year={selectedYear} onSelectTeacher={(t) => navigateTo('teacher', selectedYear, t)} />
          }
          
          {currentPage === 'teacher' && 
            <TeacherDetailsView 
              year={selectedYear} 
              teacher={selectedTeacher} 
              alunos={alunosList[selectedYear] || []}
              tarefas={tarefasList.filter(t => t.year === selectedYear && t.teacher === selectedTeacher)}
              onAddAluno={(novoAluno) => handleAddAluno(selectedYear, novoAluno)}
              onDeleteAluno={(id) => handleDeleteAluno(selectedYear, id)}
              onEditTask={(task) => navigateTo('task-form', selectedYear, selectedTeacher, task)}
              onAddTask={() => navigateTo('task-form', selectedYear, selectedTeacher)} 
            />
          }
          
          {currentPage === 'task-form' && 
            <TaskFormView 
              task={selectedTask}
              year={selectedYear}
              teacher={selectedTeacher}
              alunos={alunosList[selectedYear] || []}
              onSave={handleSaveTask}
              onDelete={handleDeleteTask}
              onCancel={() => navigateTo('teacher', selectedYear, selectedTeacher)} 
            />
          }
        </section>
      </main>
    </div>
  );
}

function LoginPage({ onLogin }) {
  const [formData, setFormData] = useState({ user: '', pass: '' });
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (formData.user === 'admpueri' && formData.pass === '12345679') {
      onLogin(true);
    } else {
      setError('Credenciais incorretas.');
    }
  };

  return (
    <div className="min-h-screen bg-blue-600 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Escola Pueri</h2>
        <p className="text-center text-gray-500 mb-8">Controle de Tarefas - Matemática</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Usuário</label>
            <input type="text" onChange={e => setFormData({...formData, user: e.target.value})} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input type="password" onChange={e => setFormData({...formData, pass: e.target.value})} className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" required />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition">Entrar</button>
        </form>
      </div>
    </div>
  );
}

function DashboardView({ tarefas }) {
  const data = ANOS.map(ano => {
    const tarefasDoAno = tarefas.filter(t => t.year === ano);
    let totalNotas = 0;
    let completas = 0;

    tarefasDoAno.forEach(t => {
      Object.values(t.notas).forEach(status => {
        totalNotas++;
        if (status === 'completa') completas++;
      });
    });

    const entregas = totalNotas > 0 ? Math.round((completas / totalNotas) * 100) : 0;
    const pendentes = totalNotas > 0 ? 100 - entregas : 0;

    return { name: ano, entregas, pendentes, totalNotas };
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Resumo Geral de Entregas</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {data.map((item, idx) => (
          <div key={item.name} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center">
            <h3 className="font-bold text-gray-700 mb-4">{item.name}</h3>
            {item.totalNotas > 0 ? (
              <>
                <div className="h-56 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie 
                        data={[{name: 'Entregue', value: item.entregas}, {name: 'Pendente', value: item.pendentes}]} 
                        innerRadius={45} 
                        outerRadius={70} 
                        paddingAngle={5} 
                        dataKey="value"
                        label={({ percent }) => percent > 0 ? `${(percent * 100).toFixed(0)}%` : ''}
                      >
                        <Cell fill={COLORS[idx]} />
                        <Cell fill="#E5E7EB" />
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 text-center">
                  <span className="text-2xl font-bold text-gray-800">{item.entregas}%</span>
                  <p className="text-sm text-gray-500">Taxa de Conclusão</p>
                </div>
              </>
            ) : (
              <div className="h-56 flex flex-col items-center justify-center text-gray-400">
                <Info size={32} className="mb-2 opacity-30" />
                <p className="text-sm">Sem dados</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ClassView({ year, onSelectTeacher }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Selecione o Professor - {year}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PROFESSORES.map(teacher => (
          <button key={teacher} onClick={() => onSelectTeacher(teacher)} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 hover:border-blue-500 hover:shadow-md transition text-left group">
            <p className="text-sm text-blue-600 font-medium mb-1">Matemática</p>
            <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600">Prof. {teacher}</h3>
            <div className="mt-4 flex items-center text-sm text-gray-500">Ver tarefas e alunos →</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function TeacherDetailsView({ teacher, year, alunos, tarefas, onAddTask, onEditTask, onAddAluno, onDeleteAluno }) {
  const [activeTab, setActiveTab] = useState('alunos');
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [novoNome, setNovoNome] = useState('');

  const alunosComStats = alunos.map(aluno => {
    const stats = { completa: 0, incompleta: 0, naofez: 0, faltou: 0 };
    tarefas.forEach(t => {
      const status = t.notas[aluno.id];
      if (status && stats[status] !== undefined) stats[status]++;
    });
    return { ...aluno, stats };
  });

  const selectedStudent = alunosComStats.find(a => a.id === selectedStudentId);

  const studentData = selectedStudent ? [
    { name: 'Completa', value: selectedStudent.stats.completa },
    { name: 'Incompleta', value: selectedStudent.stats.incompleta },
    { name: 'Não fez', value: selectedStudent.stats.naofez },
    { name: 'Faltou', value: selectedStudent.stats.faltou },
  ] : [];

  const handleSaveNovoAluno = () => {
    if (novoNome.trim() === '') return;
    onAddAluno({ id: Date.now(), nome: novoNome });
    setNovoNome('');
    setShowAddModal(false);
  };

  const handleExcluir = (e, alunoId) => {
    e.stopPropagation(); 
    if(window.confirm("Tem certeza que deseja excluir este aluno?")) {
      onDeleteAluno(alunoId);
      if (selectedStudentId === alunoId) setSelectedStudentId(null);
    }
  };

  const formatDate = (dateStr) => {
    const [y, m, d] = dateStr.split('-');
    return `${d}/${m}/${y}`;
  };

  const imprimirRelatorio = (aluno) => {
    const historico = tarefas.filter(t => t.notas[aluno.id]);
    
    let html = `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #2563EB; border-bottom: 2px solid #E5E7EB; padding-bottom: 10px;">Relatório de Desempenho</h1>
        <div style="margin-bottom: 30px;">
          <p><strong>Aluno:</strong> ${aluno.nome}</p>
          <p><strong>Turma:</strong> ${year} | <strong>Professor:</strong> ${teacher}</p>
          <p><strong>Disciplina:</strong> Matemática</p>
        </div>
        
        <h3 style="color: #374151;">Resumo Geral</h3>
        <ul style="list-style: none; padding: 0; display: flex; gap: 20px; background: #F3F4F6; padding: 15px; border-radius: 8px;">
          <li style="color: #10B981;"><strong>Completas:</strong> ${aluno.stats.completa}</li>
          <li style="color: #F59E0B;"><strong>Incompletas:</strong> ${aluno.stats.incompleta}</li>
          <li style="color: #EF4444;"><strong>Não fez:</strong> ${aluno.stats.naofez}</li>
          <li style="color: #6B7280;"><strong>Faltou:</strong> ${aluno.stats.faltou}</li>
        </ul>

        <h3 style="color: #374151; margin-top: 30px;">Histórico de Tarefas</h3>
        <table style="width: 100%; border-collapse: collapse; text-align: left;">
          <thead>
            <tr style="background: #F9FAFB; border-bottom: 2px solid #E5E7EB;">
              <th style="padding: 12px; border: 1px solid #E5E7EB;">Data</th>
              <th style="padding: 12px; border: 1px solid #E5E7EB;">Atividade</th>
              <th style="padding: 12px; border: 1px solid #E5E7EB;">Status</th>
              <th style="padding: 12px; border: 1px solid #E5E7EB;">Observação</th>
            </tr>
          </thead>
          <tbody>
    `;

    if (historico.length === 0) {
      html += `<tr><td colspan="4" style="padding: 12px; text-align: center; border: 1px solid #E5E7EB;">Nenhuma tarefa registrada.</td></tr>`;
    } else {
      historico.forEach(t => {
        const statusObj = STATUS_OPTIONS.find(o => o.id === t.notas[aluno.id]);
        const statusLabel = statusObj ? statusObj.label : '-';
        const statusColor = statusObj ? statusObj.color : '#000';
        const obs = t.observacoes[aluno.id] || '-';
        
        html += `
          <tr>
            <td style="padding: 12px; border: 1px solid #E5E7EB;">${formatDate(t.data)}</td>
            <td style="padding: 12px; border: 1px solid #E5E7EB;">${t.atividade}</td>
            <td style="padding: 12px; border: 1px solid #E5E7EB; color: ${statusColor}; font-weight: bold;">${statusLabel}</td>
            <td style="padding: 12px; border: 1px solid #E5E7EB;">${obs}</td>
          </tr>
        `;
      });
    }

    html += `</tbody></table></div>`;

    const win = window.open('', '_blank');
    win.document.write(`<html><head><title>Relatório - ${aluno.nome}</title></head><body>${html}</body></html>`);
    win.document.close();
    setTimeout(() => { win.print(); }, 500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold">Prof. {teacher}</h2>
          <p className="text-gray-500">Disciplina: Matemática | {year}</p>
        </div>
        
        {activeTab === 'tarefas' && (
          <button onClick={onAddTask} className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 font-medium hover:bg-blue-700 transition">
            <Plus size={20} /> Nova Tarefa
          </button>
        )}
        {activeTab === 'alunos' && (
          <button onClick={() => setShowAddModal(true)} className="w-full sm:w-auto bg-green-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 font-medium hover:bg-green-700 transition">
            <UserPlus size={20} /> Novo Aluno
          </button>
        )}
      </div>

      <div className="flex border-b border-gray-200">
        <button onClick={() => setActiveTab('alunos')} className={`px-6 py-3 font-medium transition ${activeTab === 'alunos' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>Alunos</button>
        <button onClick={() => setActiveTab('tarefas')} className={`px-6 py-3 font-medium transition ${activeTab === 'tarefas' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500'}`}>Histórico</button>
      </div>

      {activeTab === 'alunos' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
                <tr><th className="px-6 py-3">Aluno</th><th className="px-6 py-3">Ações</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {alunosComStats.map(aluno => (
                  <tr key={aluno.id} className="hover:bg-blue-50 cursor-pointer transition" onClick={() => setSelectedStudentId(aluno.id)}>
                    <td className="px-6 py-4 font-medium">{aluno.nome}</td>
                    <td className="px-6 py-4 flex items-center gap-4">
                      <span className="text-blue-600 text-sm font-medium">Ver gráfico</span>
                      <button 
                        onClick={(e) => handleExcluir(e, aluno.id)} 
                        className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition"
                        title="Excluir Aluno"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {alunos.length === 0 && (
              <p className="text-center text-gray-400 py-6">Nenhum aluno cadastrado nesta sala.</p>
            )}
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border min-h-75 flex flex-col items-center justify-center relative">
            {selectedStudent ? (
              <>
                <div className="w-full flex justify-between items-start mb-4">
                  <h3 className="font-bold text-gray-700">Desempenho: {selectedStudent.nome}</h3>
                  <button 
                    onClick={() => imprimirRelatorio(selectedStudent)}
                    className="flex items-center gap-2 text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition"
                    title="Imprimir Relatório"
                  >
                    <Printer size={16} /> Relatório
                  </button>
                </div>
                
                {selectedStudent.stats.completa === 0 && selectedStudent.stats.incompleta === 0 && selectedStudent.stats.naofez === 0 && selectedStudent.stats.faltou === 0 ? (
                  <p className="text-gray-400 text-center flex-1 flex items-center">Este aluno ainda não tem tarefas registradas.</p>
                ) : (
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie 
                          data={studentData} 
                          innerRadius={45} 
                          outerRadius={70} 
                          dataKey="value"
                          label={({ percent }) => percent > 0 ? `${(percent * 100).toFixed(0)}%` : ''}
                        >
                          {studentData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center text-gray-400">
                <Info size={48} className="mx-auto mb-2 opacity-20" />
                <p>Selecione um aluno para ver o gráfico</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
              <tr>
                <th className="px-6 py-3">Data</th>
                <th className="px-6 py-3">Atividade</th>
                <th className="px-6 py-3 text-center">Entregas</th>
                <th className="px-6 py-3">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tarefas.map(tarefa => {
                const completas = Object.values(tarefa.notas).filter(n => n === 'completa').length;
                return (
                  <tr key={tarefa.id} className="hover:bg-blue-50 cursor-pointer transition" onClick={() => onEditTask(tarefa)}>
                    <td className="px-6 py-4 text-sm text-gray-600">{formatDate(tarefa.data)}</td>
                    <td className="px-6 py-4 font-medium text-gray-800">{tarefa.atividade}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                        {completas}/{alunos.length} Completas
                      </span>
                    </td>
                    <td className="px-6 py-4 text-blue-600 text-sm font-medium flex items-center gap-1">
                      <Edit size={16} /> Editar
                    </td>
                  </tr>
                );
              })}
              {tarefas.length === 0 && (
                <tr><td colSpan="4" className="text-center text-gray-400 py-6">Nenhuma tarefa registrada nesta turma.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <UserPlus className="text-green-600" /> Adicionar Aluno
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
              <input 
                type="text" 
                autoFocus
                value={novoNome}
                onChange={(e) => setNovoNome(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSaveNovoAluno()}
                placeholder="Ex: João da Silva..." 
                className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none" 
              />
            </div>
            
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl font-medium transition">Cancelar</button>
              <button onClick={handleSaveNovoAluno} className="px-6 py-2 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-200 transition">Adicionar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TaskFormView({ task, year, teacher, alunos, onSave, onDelete, onCancel }) {
  const isEditing = !!task;
  const [atividade, setAtividade] = useState(task?.atividade || '');
  const [data, setData] = useState(task?.data || new Date().toISOString().split('T')[0]);
  
  const [notas, setNotas] = useState(task?.notas || {});
  const [observacoes, setObservacoes] = useState(task?.observacoes || {});

  const handleStatusChange = (alunoId, statusId) => {
    setNotas({ ...notas, [alunoId]: statusId });
  };

  const handleObsChange = (alunoId, value) => {
    setObservacoes({ ...observacoes, [alunoId]: value });
  };

  const handleMarcarTodos = () => {
    const novasNotas = { ...notas };
    alunos.forEach(aluno => {
      novasNotas[aluno.id] = 'completa';
    });
    setNotas(novasNotas);
  };

  const handleSaveClick = () => {
    if (!atividade.trim()) return alert("Por favor, preencha o nome da atividade.");
    onSave({ id: task?.id, year, teacher, atividade, data, notas, observacoes });
  };

  const handleDeleteClick = () => {
    if (window.confirm("Tem certeza que deseja apagar esta tarefa do histórico?")) {
      onDelete(task.id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <ClipboardList className="text-blue-600"/> 
          {isEditing ? 'Editar Tarefa' : 'Registrar Nova Tarefa'}
        </h2>
        <div className="flex gap-2 w-full sm:w-auto">
          {isEditing && (
            <button onClick={handleDeleteClick} className="text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg flex items-center gap-2 font-medium transition">
              <Trash2 size={18} /> <span className="hidden sm:inline">Apagar Tarefa</span>
            </button>
          )}
          <button onClick={handleMarcarTodos} className="bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1.5 rounded-lg flex items-center gap-2 font-medium transition w-full sm:w-auto justify-center">
            <CheckCheck size={18} /> Marcar Todos Completos
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Atividade Sobre:</label>
          <input type="text" value={atividade} onChange={(e) => setAtividade(e.target.value)} placeholder="Ex: Teorema de Pitágoras" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Data:</label>
          <input type="date" value={data} onChange={(e) => setData(e.target.value)} className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden overflow-x-auto">
        <table className="w-full text-left min-w-150">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold">
            <tr><th className="px-6 py-4">Aluno</th><th className="px-6 py-4">Status</th><th className="px-6 py-4">Observação</th></tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {alunos.map(aluno => (
              <tr key={aluno.id}>
                <td className="px-6 py-4 font-medium whitespace-nowrap">{aluno.nome}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-2">
                    {STATUS_OPTIONS.map(opt => (
                      <label key={opt.id} className="cursor-pointer group relative">
                        <input 
                          type="radio" 
                          name={`status-${aluno.id}`} 
                          checked={notas[aluno.id] === opt.id}
                          onChange={() => handleStatusChange(aluno.id, opt.id)}
                          className="sr-only peer" 
                        />
                        <div className="px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1 transition-all peer-checked:bg-opacity-10 peer-checked:ring-2" 
                             style={{ borderColor: '#E5E7EB', '--tw-ring-color': opt.color, '--tw-bg-opacity': '0.1' }}>
                          {opt.icon} <span className="hidden sm:inline">{opt.label}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <input 
                    type="text" 
                    value={observacoes[aluno.id] || ''}
                    onChange={(e) => handleObsChange(aluno.id, e.target.value)}
                    placeholder="Nota rápida..." 
                    className="w-full min-w-37.5 p-2 bg-gray-50 border border-transparent focus:bg-white focus:border-blue-300 rounded-lg text-sm outline-none transition" 
                  />
                </td>
              </tr>
            ))}
            {alunos.length === 0 && (
              <tr>
                <td colSpan="3" className="px-6 py-8 text-center text-gray-400">Nenhum aluno na sala. Adicione alunos primeiro.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button onClick={onCancel} className="px-6 py-2 border rounded-xl font-medium hover:bg-gray-50 transition">Cancelar</button>
        <button onClick={handleSaveClick} className="px-8 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg transition">
          {isEditing ? 'Atualizar Tarefa' : 'Salvar Tarefa'}
        </button>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-sm font-medium ${active ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}>
      {icon} {label}
    </button>
  );
}