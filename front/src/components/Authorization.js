import React from 'react'
import {useHistory} from "react-router-dom";
import "../style/authorization.css"

export const Authorization = () => {
    let history = useHistory()

    //Авторизация пользователя
    async function signIn(e) {
        e.preventDefault()
        let str = e.target[0].value+","+e.target[1].value;
        let user = await fetch("http://localhost:5000/users", {
            method: 'POST', 
            body: str,
        }) 
        let result = await user.json()
        if(user.status === 200) {
            if(result === 'uncorrect') {
                alert('Не вірний логін або пароль')
            } else {
                console.log(result)
                localStorage.setItem("role", result.role)
                localStorage.setItem("token", result.token)
                history.push("/tasks")
            }
        } else {
            alert("Помилка сервера, спробуйте пізніше")
        }
    }

    return (
        <div className="auth">
           
            <form onSubmit={(e)=>{signIn(e)}}>
                <label htmlFor="nickname">Нік</label><br/>
                <input type='text' name="nickname" required /><br/>
                <label htmlFor="password">Пароль</label><br/>
                <input type='password' name="password" required /><br/>
                <button className="auth__button" type="submit">Ввійти</button>
            </form>
        </div>
    )
}
