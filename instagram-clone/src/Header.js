import { useEffect, useState } from 'react';
import firebase from 'firebase';
import { auth, storage, db } from './firebase..js';

function Header(props) {

    const [progress, setProgress] = useState(0);
    const [file, setFile] = useState(null);

    useEffect(() => {
        
    }, [])

    function criarConta(e) {
        e.preventDefault();
        let email = document.getElementById('email-cadastro').value;
        let username = document.getElementById('username-cadastro').value;
        let password = document.getElementById('password-cadastro').value;

        auth.createUserWithEmailAndPassword(email, password)
            .then((authUser) => {
                authUser.user.updateProfile({
                    displayName:username
                })
                fecharModalCriar();
            }).catch((error) => {
                alert(error.message);
            })
    }

    function logar(e) {
        e.preventDefault();
        let email = document.getElementById('email-login').value;
        let password = document.getElementById('password-login').value;

        auth.signInWithEmailAndPassword(email, password)
            .then((auth) => {
                props.setUser(auth.user.displayName);
                window.location.href = '/';
            }).catch((error) => {
                alert(error.message);
            })
    }

    function abrirModalCriarConta(e) {
        e.preventDefault();

        let modal = document.querySelector('.modalCriarConta');
        modal.style.display = 'flex';
    }
    function abrirModalUpload(e) {
        e.preventDefault();

        let modal = document.querySelector('.modalUpload');
        modal.style.display = 'flex';
    }

    function fecharModalCriar() {
        let modal = document.querySelector('.modalCriarConta');
        modal.style.display = 'none';
    }
    function fecharModalUpload() {
        let modal = document.querySelector('.modalUpload');
        modal.style.display = 'none';
    }

    function signout(e) {
        e.preventDefault();

        auth.signOut().then((val) => {
            props.setUser(null);
            window.location.href = '/';
        })
    }

    function uploadPost(e) { // sendo utilizado constantes de arquivo e progresso das linhas 7 e 8
        e.preventDefault(); // previne que o form envie um formulário

        let descPost = document.getElementById('descricao-upload').value;

        const uploadTask = storage.ref(`images/${file.name}`).put(file);    // pega o storage do banco de dados, com a referência 'images/${nome do arquivo enviado}' (se não existir, é criado) e insere o arquivo no local

        uploadTask.on('state_changed', function(snapshot) { // no momento que o armazenamento for mudado (state_changed), é feito uma função para calcular o quanto a barra de progresso vai estar
            const progress = Math.round(snapshot.bytesTransferred/snapshot.totalBytes) * 100;   // calculo para obter o quanto foi transferido do arquivo para o quanto tem no total
            setProgress(progress);  // altera o valor da barra de progresso a partir do resultado do calculo acima
        }, function(error) {alert(error)}, function() {
            storage.ref('images').child(file.name).getDownloadURL() // quando terminou o upload e deu certo, pega a URL do arquivo a partir do nome
                .then(function(url) {
                    db.collection('posts').add({    // adiciona na coleção posts do banco de dados os registros do arquivo (se não existir coleção, é criada)
                        description: descPost,
                        image: url,
                        userName: props.user,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp()
                    })

                    setProgress(0); // reseta a barra de progresso e esvazia a variável de arquivo
                    setFile(null);

                    fecharModalUpload();
                })
        })
    }

    return (

        <div className='header'>

            <div className='modalCriarConta'>
                <div className='formCriarConta'>
                    <div onClick={() => fecharModalCriar()} className='close-modal-criar'>X</div>
                    <h2>Criar conta</h2>
                    <form onSubmit={(e) => criarConta(e)}>
                        <input id='email-cadastro' type='text' placeholder='seu e-mail...' />
                        <input id='username-cadastro' type='text' placeholder='seu nome de usuário...' />
                        <input id='password-cadastro' type='password' placeholder='sua senha...' />
                        <input type='submit' value='Criar Conta!' />
                    </form>
                </div>
            </div>

            <div className='modalUpload'>
                <div className='formUpload'>
                    <div onClick={() => fecharModalUpload()} className='close-modal-criar'>X</div>
                    <h2>Fazer upload</h2>
                    <form id='form-upload' onSubmit={(e) => uploadPost(e)}>
                        <progress id='progress-upload' value={progress}></progress>
                        <input id='descricao-upload' type='text' placeholder='Descrição...' />
                        <input onChange={(e) => setFile(e.target.files[0])} type='file' name='file' />
                        <input type='submit' value='Publicar' />
                    </form>
                </div>
            </div>

            <div className='center'>
                <div className='header__logo'>
                    <a href='#'><img alt='' src='https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/instagram-text-icon.png' /></a>
                </div>

                {
                    (props.user) ?
                        <div className='header__logadoInfo'>
                            <span>Olá <b>{props.user}</b></span>
                            <a onClick={(e) => abrirModalUpload(e)} href='#'>Postar</a>
                            <a onClick={(e) => signout(e)}>Sair</a>
                        </div>
                        :
                        <div className='header__loginForm'>
                            <form onSubmit={(e) => logar(e)}>
                                <input id='email-login' type='text' placeholder='e-mail' />
                                <input id='password-login' type='password' placeholder='senha' />
                                <input type='submit' name='acao' value='logar!' />
                            </form>
                            <div className='btn__criarConta'>
                                <a onClick={(e) => abrirModalCriarConta(e)} href='#'>Criar Conta</a>
                            </div>
                        </div>
                }
            </div>
        </div>
    )
}

export default Header;