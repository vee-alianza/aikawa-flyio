import { FaGithubAlt, FaLinkedin } from "react-icons/fa";

import './Footer.css'

const Footer = () => {
    return (
        <div className='footer__container'>
            <div className='footer__tech'>
                <p>Python</p>
                <p>Flask</p>
                <p>SQLAlchemy</p>
                <p>Alembic</p>
                <p>Javascript</p>
                <p>React</p>
                <p>Redux</p>
            </div>
            <div className='footer__about'>
                <p>Created by: Vee Alianza</p>
                <a href='https://github.com/vee-alianza'>
                    <FaGithubAlt size={25} />
                </a>
                <a href='https://www.linkedin.com/in/vee-alianza/'>
                    <FaLinkedin size={25} />
                </a>
            </div>
        </div>
    )
}

export default Footer;
