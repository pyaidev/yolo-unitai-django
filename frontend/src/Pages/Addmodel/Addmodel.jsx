import React from 'react'
import Action from '../../Assets/Images/svg/action.svg'
import redac from '../../Assets/Images/svg/redac.svg'
import Delet from '../../Assets/Images/svg/delet.svg'

const Addmodel1 = () => {
  return (
    <div className="outlet">
    <div className="addcamera">
       <form className="addcamera__form" action="">
           <h2>Добавить модель</h2>
           <label>
               <p>Адрес модели</p>
               <input type="text" placeholder=".../backend/datasets/best1.pt"/>
           </label>
           <label>
               <p>Настройки</p>
               <input type="text" placeholder=".../backend/datasets/settings.yaml"/>
           </label>
           <label>
               <p>Название</p>
               <input type="text" placeholder="Какая-то офигенная модель"/>
           </label>
           <label>
               <p>Телефон</p>
               <input type="text" placeholder="+7 987 654 3211"/>
           </label>              
           <button>
               Сохранить
           </button>
       </form>
    </div>
    <div className="addcameratable">
       <table>
           <thead>
               <tr>
                   <th>Название</th>
                   <th>Адрес модели</th>
                   <th>Адрес настроек</th>                      
                   <th className="table-action"></th>
               </tr>
           </thead>
           <tbody>
               <tr>
                   <td>Модель 1</td>
                   <td>.../backend/datasets/best1.pt   </td>
                   <td>.../backend/datasets/best1.pt</td>
                   <td id="actionicon1" className="tbody-action">
                       <img src={Action} alt=""/>
                       <div id="actionicon1wrap" class="tbody-action__wrap">
                           <div id="redac" className="actionwrapinner">
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

export default Addmodel1