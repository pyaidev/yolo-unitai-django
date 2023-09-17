import React from 'react'
import Action from '../../Assets/Images/svg/action.svg'
import redac from '../../Assets/Images/svg/redac.svg'
import Delet from '../../Assets/Images/svg/delet.svg'

const Pozvatol = () => {
    
  return (
    <div className="outlet">
    <div className="addcamera">
       <form className="addcamera__form" action="">
           <h2>Добавить пользователя</h2>
           <label>
               <p>Логин</p>
               <input type="text" placeholder="Login"/>
           </label>
           <label>
               <p>Пароль</p>
               <input type="text" placeholder="Пароль"/>
           </label>
           <label>
               <p>Компания</p>
               <input type="text" placeholder="ООО “Ромашка”"/>
           </label>
           <label>
               <p>Телефон</p>
               <input type="text" placeholder="+7 987 654 3211"/>
           </label>
           <label>
               <p>ФИО</p>
               <input type="text" placeholder="Иванов Иван Иванович"/>
           </label>
           <label>
               <p>Модель</p>
               <select  id="">
                   <option selected hidden  value="">Dropdown-list</option>
                   <option  value="">model</option>
               </select>
           </label>

           <label for="" class="label-check">
               <input type="checkbox"/>
               <p>Администратор</p>
           </label>
         
           <button>
               Сохранить
           </button>
       </form>
    </div>
    <div class="addcameratable">
       <table>
           <thead>
               <tr>
                   <th>Логин</th>
                   <th>Компания</th>
                   <th>Телефон</th>
                   <th>ФИО</th>
                   <th>Модели</th>
                 
                   <th className="table-action"></th>
               </tr>
           </thead>
           <tbody>
               <tr>
                   <td>User 1</td>
                   <td>ООО “Ромашка”</td>
                   <td>+79876543211</td>
                   <td>Иванов Иван Иванович</td>
                   <td>Модель 1
                       Модель 2
                       Модель 3</td>
                   
                       <td id="actionicon1" className="tbody-action">
                           <img id="actionimg1" src={Action} alt=""/>
                   
                           <div id="actionicon1wrap" className="tbody-action__wrap">
                               <div id="redac" class="actionwrapinner">
                                   <img src={redac} alt=""/>
                                   <p>Редактировать</p>
                               </div>
                               <div id="delet" className="actionwrapinner">
                                   <img src={Delet} alt=""/>
                                   <p>Удалить</p>
                               </div>
                           </div>
                       </td>
               </tr>
              
            
           </tbody>
       </table>
    </div>
 </div>
  )
}

export default Pozvatol