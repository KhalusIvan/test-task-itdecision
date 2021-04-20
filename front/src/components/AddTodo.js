import React, {useRef, useState} from 'react'
import "../style/addTodo.css"

export const AddTodo = (props) => {
    const refInput = useRef(null);
    const [input, setInput] = useState(null)

    //Добавляем задание с файла
    async function addTodo(e) {
        e.preventDefault();
        if (refInput.current.files.length === 0) {
            alert("Виберіть файл")
        } else {
            var fr=new FileReader();
            fr.readAsText(refInput.current.files[0]);
            fr.onload=async function(){
                let task = await fetch("http://localhost:5000/tasks", {
                    method: 'POST', 
                    headers: {
                        'Authorization': localStorage.getItem('token'),
                    },
                    body: fr.result,
                }) 
                let result = await task.json()
                if (task.status === 200 && result.length !== 0) {
                    let newArr = props.items.concat(result)
                    props.setItems(newArr)
                    setInput(null)
                } else if (task.status === 200 && result.length === 0) {
                    alert('Всі файли - дублікати')
                } else {
                    alert('Помилка сервера')
                } 
            }    
        }  
    }

    return (
        <form className="add__form" onSubmit={(e)=>{addTodo(e)}}>
            <label className="add__label" htmlFor="fileAdd">
                {
                    input === null ? (
                        <span>Вибрати файл</span>
                    ) : (
                        <span>{input}</span>
                    )
                }
            </label>
            <input onChange={()=>{refInput.current.files[0]?setInput(refInput.current.files[0].name):setInput(null)}} className="add__input" ref={refInput} type="file" id="fileAdd" name="fileAdd" accept=".txt" />
            <button className="add__button" type='submit'>Додати завдання</button>
        </form>
    )
}
