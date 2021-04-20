import React, {useEffect, useState} from 'react'
import {useHistory, useParams} from "react-router-dom";
import { Loader } from './Loader';
import "../style/oneTodo.css"

export const OneTodo = (props) => {
    let history = useHistory()
    let [task, setTask] = useState(null)
    let params = useParams()
    useEffect(()=>{
        getTask()
    }, [])

    //Ищем задание
    async function getTask(){
        let users = await fetch("http://localhost:5000/tasks/"+params.id, {
            method: 'GET'
        }) 
        let result = await users.json()
        setTask(result)
    }
    
    //Форматируем дату
    function createDate(time) {
        let date = new Date(time);
        console.log(date.toDateString())
        let strHours = date.getHours() + ":" + date.getMinutes()
        let strDate = date.getDate() + "." + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + "." + date.getFullYear()
        return strHours + " " + strDate
    }

    return (
        <>
            {
                task === null ? (
                    <Loader />
                ) : (
                    <div className="container">
                        <div className="info">
                            <h2 className="info__title">{task.title}</h2>
                            <div className="info__flexed">
                                <div>{task.category}</div>
                                <div>{createDate(task.time)}</div> 
                            </div>
                            <div className="info__description">{task.description}</div>  
                            <button className="info__return" onClick={()=>{history.push('/tasks')}}>Повернутися до списку</button>
                        </div>
                    </div>                      
                )
            }
        </>
    )
}
