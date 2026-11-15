import { useEffect, useState } from 'react';
import { Link, Routes, Route } from 'react-router-dom';

const API_CADASTROS = 'http://localhost:3000/cadastros';

function Inicio() {
  return (
    <div>
      <h2>Início</h2>
      <p>Este é um trabalho de cadastro de filmes e séries.</p>
      <p>Na página Cadastro, você pode adicionar títulos à lista.</p>
      <Link to="/cadastro">Ir para Cadastro</Link>
    </div>
  );
}

function Cadastro() {
  const [titulo, setTitulo] = useState('');
  const [ano, setAno] = useState('');
  const [tipo, setTipo] = useState('');
  const [assistido, setAssistido] = useState(false);
  const [erro, setErro] = useState('');
  const [lista, setLista] = useState([]);
  const [erroLista, setErroLista] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function carregarCadastros() {
      try {
        const resposta = await fetch(API_CADASTROS, { signal: controller.signal });
        if (!resposta.ok) {
          throw new Error('A API não conseguiu carregar os cadastros.');
        }

        const cadastros = await resposta.json();
        if (!Array.isArray(cadastros)) {
          throw new Error('A API retornou uma lista inválida.');
        }

        setLista(cadastros);
      } catch (error) {
        if (error.name !== 'AbortError') {
          setErroLista(
            error instanceof TypeError
              ? 'JSON server desligado.'
              : error.message
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setCarregando(false);
        }
      }
    }

    carregarCadastros();
    return () => controller.abort();
  }, []);

  async function salvar(evento) {
    evento.preventDefault();

    if (!titulo.trim() || !ano || !tipo) {
      setErro('Preencha os campos obrigatórios.');
      return;
    }

    if (Number(ano) <= 0) {
      setErro('O ano deve ser maior que zero.');
      return;
    }

    const novoItem = {
      titulo: titulo.trim(),
      ano: Number(ano),
      tipo: tipo,
      assistido: assistido,
    };

    setSalvando(true);
    setErro('');

    try {
      const resposta = await fetch(API_CADASTROS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoItem),
      });

      if (!resposta.ok) {
        throw new Error('A API não conseguiu salvar o cadastro.');
      }

      const cadastroSalvo = await resposta.json();
      setLista((cadastros) => [...cadastros, cadastroSalvo]);
      setErroLista('');
      setTitulo('');
      setAno('');
      setTipo('');
      setAssistido(false);
    } catch (error) {
      setErro(
        error instanceof TypeError
          ? 'Não foi possível conectar à API. Verifique se o json-server está rodando.'
          : error.message
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div>
      <h2>Cadastro</h2>
      <form onSubmit={salvar} noValidate>
        <label htmlFor="titulo">Título *</label>
        <input
          id="titulo"
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />

        <label htmlFor="ano">Ano *</label>
        <input
          id="ano"
          type="number"
          value={ano}
          onChange={(e) => setAno(e.target.value)}
        />

        <label htmlFor="tipo">Tipo *</label>
        <select id="tipo" value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="">Selecione</option>
          <option value="Filme">Filme</option>
          <option value="Série">Série</option>
        </select>

        <label className="checkbox">
          <input
            type="checkbox"
            checked={assistido}
            onChange={(e) => setAssistido(e.target.checked)}
          />
          Já assisti
        </label>

        {erro && <p className="erro" role="alert">{erro}</p>}
        <button type="submit" disabled={salvando}>
          {salvando ? 'Salvando...' : 'Salvar'}
        </button>
      </form>

      <h3>Lista de cadastros</h3>
      {erroLista ? (
        <p className="erro" role="alert">{erroLista}</p>
      ) : carregando ? (
        <p>Carregando cadastros...</p>
      ) : lista.length === 0 ? (
        <p>Nenhum cadastro ainda.</p>
      ) : (
        <ul>
          {lista.map((item) => (
            <li key={item.id}>
              {item.titulo} - {item.ano} - {item.tipo} -{' '}
              {item.assistido ? 'Assistido' : 'Não assistido'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Sobre() {
  return (
    <div>
      <h2>Sobre</h2>
      <p>Trabalho da disciplina de Programação Web II.</p>
      <p>O objetivo é praticar formulários e estados no React.</p>
    </div>
  );
}

function PaginaNaoEncontrada() {
  return (
    <div>
      <h2>Página não encontrada</h2>
      <p>O endereço informado não existe.</p>
      <Link to="/">Voltar ao início</Link>
    </div>
  );
}

function App() {
  return (
    <>
      <header>
        <h1>Trabalho</h1>
        <nav>
          <Link to="/">Início</Link>
          <Link to="/cadastro">Cadastro</Link>
          <Link to="/sobre">Sobre</Link>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="*" element={<PaginaNaoEncontrada />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
