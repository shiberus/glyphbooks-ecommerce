import React from "react";
import style from ".././CSS/Faq.module.scss";

export default function Faq() {
  return (
    <div className={style.html}>
      <div className={style.container}>
        <div className={style.accordion}>
          <div className={style.accordionitem} id="question1">
            <a className={style.accordionlink} href="#question1">
              ¿Quienes Somos?
            </a>
            <div className={style.answer}>
              <p>
                GlyphBooks® comenzo como un micro emprendimiento en el año 2011.
                Gracias a nuestro arzobispo de SQL, Peter Chen, pudimos salir
                adelante. Hoy estamos aqui predicando la palabra del modelo
                entidad relacion.
              </p>
            </div>
          </div>

          <div className={style.accordionitem} id="question2">
            <a className={style.accordionlink} href="#question2">
              ¿Quien es Peter Chen?
            </a>
            <div className={style.answer}>
              <p>
                El Dr. Peter Pin-Shan Chen (en chino: Chen Pin-Shan (en chino
                tradicional, 陳品山; pinyin, Chén Pǐnshān, Taichung; 3 de enero
                de 1947) Es el creador del Modelo Entidad-Relación (Modelo ER) y
                arzobispo de la iglesia de SQL. El vino al mundo para JOINEAR
                nuestros corazones en la TABLE de la vida.
              </p>
            </div>
          </div>

          <div className={style.accordionitem} id="question3">
            <a className={style.accordionlink} href="#question3">
              ¿Como es el paraiso de SQL?
            </a>
            <div className={style.answer}>
              <p>
                El paraiso profetizado por el arzobispo Chen, es un lugar donde
                no habra mas fallas de sintaxis, donde podremos crear relaciones
                entre nuestras TABLES sin temor al Demonio Error 404. Porque,
                Peter Chen Dijo "Venid a mi, y os dare la gracia de JavaScript,
                y la dicha de Sequelize, todo aquel que me siga, podra crear
                modelos fuera del command prompt"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
