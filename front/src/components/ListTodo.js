import React, {useState, useEffect} from 'react'
import '../style/listTodo.css'
import check from "../images/check.svg"
import view from "../images/view.svg"
import { AddTodo } from './AddTodo';
import { Loader } from './Loader';
import {useHistory} from "react-router-dom";

export const ListTodo = () => {
    let [items, setItems] = useState(null)
    let history = useHistory()

    useEffect(()=>{
        getTasks()
    }, [])

    //Ищем задания
    async function getTasks(){
        let tasks = await fetch("http://localhost:5000/tasks", {
            method: 'GET'
        }) 
        let result = await tasks.json()
        console.log(result)
        setItems(result)
    }

    //Позначить задание как исполненое
    async function setDone(id){
        let tasks = await fetch("http://localhost:5000/tasks/" + id, {
            method: 'POST',
            body: id
        }) 
        let result = await tasks.json()
        console.log(result)
        console.log(tasks.status)
        if (tasks.status === 200) {
            setItems(items.filter((el)=>{return el._id !== id}))
        }
    }

    function ListItems() {
        let listItems = items.map(el => {
            return <li className="list_item" key={el._id}>
                <button className="list_buttons" onClick={()=>{setDone(el._id)}}>
                    <img alt="check" src={check} />
                </button>
                <span>{el.category}</span>
                <span>{el.title}</span>
                <button className="list_buttons" onClick={()=>{history.push('/tasks/'+el._id);}}>
                    <img alt="view" src={view} />
                </button>
            </li>
        })
        return listItems;
    }

    return (
        <>
            {
               Array.isArray(items) ? (
                   <>
                        <h1 className="list__title">Список завдань</h1>
                        <div className="list">
                            <ul>
                                <ListItems />
                                {
                                    localStorage.getItem('role') === 'admin' ? (
                                        <AddTodo items={items} setItems={setItems} />
                                    ):(<></>)
                                }
                            </ul>
                        </div>
                    </>
               ) : (
                <Loader />
               )
            } 
        </>
    )
}
