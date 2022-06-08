import logo from './logo.svg';
import './App.css';
import {useState} from 'react';

function Header(props){
  return <header>
    <h1><a href='/' onClick={function(event){
      event.preventDefault();
      props.onChangeMode();
    }}>{props.title}</a></h1>
  </header>
}
function Nav(props){
  const lis = []
  for(let i=0; i<props.topics.length; i++){
    let t = props.topics[i]
    lis.push(<li key={t.id}>
      <a id={t.id} href={'/read/'+t.id} onClick={event=>{
      event.preventDefault();
      props.onChangeMode(Number(event.target.id));
    }}>{t.title}</a></li>)
  }
  return <nav>
      <ol>
        {lis}
      </ol>
    </nav>
}
function Article(props){
  return <article>
    <h2>{props.title}</h2>
    {props.body}
  </article>
}
function Create(props){
  return <article>
    <h2>Create</h2>
    <form onSubmit={event=>{
      event.preventDefault();
      const title = event.target.title.value;
      const body = event.target.body.value;
      props.onCreate(title, body);
    }}>
      <p><input type="text" name="title" placeholder='title'/></p>
      <p><textarea name='body' placeholder='body'></textarea></p>
      <p><input type="submit" value="Create"></input></p>
    </form>
  </article>
}
function Update(props){
  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState(props.body);
  return <article>
    <h2>Update</h2>
    <form onSubmit={event=>{
      event.preventDefault();
      const title = event.target.title.value;
      const body = event.target.body.value;
      props.onUpdate(title, body);
    }}>
      <p><input type="text" name="title" placeholder='title' value={title} onChange={event=>{
        setTitle(event.target.value);
      }}/></p>
      <p><textarea name='body' placeholder='body' value={body} onChange={event=>{
        setBody(event.target.value);
      }}></textarea></p>
      <p><input type="submit" value="Update"></input></p>
    </form>
  </article>
}
function App() {
  //const _mode = useState('WELCOME');
  //const mode = _mode[0];
  //const setMode = _mode[1];
  const [mode, setMode] = useState('WELCOME');
  const [id, setId] = useState(null);
  const [nextId, setNextId] = useState(4);
  const [topics, setTopics] = useState([
    {id:1, title:'html', body:'html is ...'},
    {id:2, title:'css', body:'css is ...'},
    {id:3, title:'js', body:'js is ...'}
  ])
  let content = null; 
  let contextControl = null;
  if(mode == 'WELCOME'){
    content = <Article title="Welcome" body="Hello, WEB"></Article>
  }
  else if(mode === 'READ'){
    let title, body = null;
    for(let i=0;i<topics.length;i++){
      if(topics[i].id === id){
          //id 값이 int여야 하는데, 
          //onChangeMode 함수에 의하면 문자열을 타입으로 받기 때문에 
          //인자가 받아지지 않는다. 
          //그래서 if문이 만족되지 않는다
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Article title={title} body={body}></Article>
    //READ 상태에서만 update 가 표시됨
    contextControl = <>
      <li><a href={'/update/'+id} onClick={event=>{
        event.preventDefault();
        setMode('UPDATE');
      }}>Update</a></li>
      <li><input type="button" value="Delete" onClick={()=>{
        const newTopics = []
        for(let i=0;i<topics.length;i++){
          if(topics[i].id !== id){
            newTopics.push(topics[i]);
          }
        }
        setTopics(newTopics);
        setMode('WELCOME')
        for(let i=0;i<topics.length;i++){
          console.log(topics[i])
        }
      }}></input></li>
    </>
  }
  else if(mode === 'CREATE'){
    content = <Create onCreate={(_title, _body)=>{
      //배열 객체를 보낼 경우, 복제한 데이터를 변경 후 (set)보내야한다
      const newTopic = {id:nextId, title:_title, body:_body}
      const newTopics = [...topics]
      newTopics.push(newTopic);
      setTopics(newTopics);
      //객체 생성 후 페이지 갱신
      setMode('READ');
      setId(nextId);
      setNextId(nextId+1);
    }}></Create>
  }
  else if(mode === 'UPDATE'){
    let title, body = null;
    for(let i=0;i<topics.length;i++){
      if(topics[i].id === id){
        title = topics[i].title;
        body = topics[i].body;
      }
    }
    content = <Update title={title} body={body} onUpdate={(_title, _body)=>{
      const newTopics = [...topics]
      const updatedToipic = {id:id, title:_title, body:_body}
      for(let i=0;i<topics.length;i++){
        if(newTopics[i].id == updatedToipic.id){
          newTopics[i] = updatedToipic;
          break;
        }
      }
      setTopics(newTopics);
      setMode('READ');
    }}></Update>
  }
  state = {
    id : "",
  }
  handleChange =(e)=>{
    this.setState({
      [e.target.name] : e.target.value,
    });
  }
  return (
    <div className="App">
        <Header title="REACT" onChangeMode={function(){
          setMode('WELCOME');
        }}></Header>
        <Nav topics={topics} onChangeMode={(_id)=>{
          setMode('READ');
          setId(_id);
        }}></Nav>
        {content}
        <ul>
          <li><a href='/create' onClick={event=>{
            event.preventDefault();
            setMode('CREATE');
          }}>Create</a></li>
          {contextControl}
        </ul>
    </div>
  );
}

export default App;
