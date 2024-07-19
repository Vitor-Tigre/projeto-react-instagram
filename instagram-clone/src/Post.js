import { db } from './firebase..js';
import { useEffect, useState } from 'react';
import firebase from 'firebase';

function Post(props) {

    const [comments, setComments] = useState([]);

    useEffect(() => {
        db.collection('posts').doc(props.id).collection('comments').orderBy('timestamp', 'asc').onSnapshot((snapshot) => {
            setComments(snapshot.docs.map((document) => {
                return {
                    id: document.id,
                    info: document.data()
                }
            }))
        })
    })

    function comentar(id, e) {
        e.preventDefault();

        let currentComment = document.getElementById('comment-' + id).value;
        document.getElementById('comment-' + id).value = "";

        db.collection('posts').doc(id).collection('comments').add({
            name: props.user,
            comment: currentComment,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        })
    }

    return (
        <div className='postSingle'>
            <img src={props.info.image} />
            <p><b>{props.info.userName}</b>  {props.info.description}</p>

            <div className='commentsSection'>

                {
                    comments.map((val) => {
                        return (
                            <div className='comment-single'>
                                <p><b>{val.info.name}</b>  {val.info.comment}</p>
                            </div>
                        )
                    })
                }

            </div>

            {
                (props.user) ?
                    <form onSubmit={(e) => { comentar(props.id, e) }}>
                        <textarea id={"comment-" + props.id}></textarea>
                        <input type='submit' value='comentar' />
                    </form>
                    :
                    <div></div>
            }

        </div>
    )
}

export default Post;