import React, {useState } from 'react';
import {b_login, containerAuth, containerStyles, log_in, pass_in, sp_1, sp_2} from './loginStyle';
import { Button, Form } from 'react-bootstrap';
import { ErrorMessage } from '../../components/error-message';
import { useNavigate } from "react-router-dom";
import { useLoginMutation, VitaUser } from "../../app/services/auth";
import { isErrorWithMessage } from '../../utils/is-error-with-message';
import { setUser } from '../../actions/userActions';
import { useDispatch } from 'react-redux';
import { useCheckFirstSeeWelcomeDataMutation } from '../../app/services/utils_services/firstsee';


const LoginForm: React.FC = () => {

  const navigate = useNavigate();
  
  const dispatch = useDispatch();

  const [error, setError] = useState("");

  const [loginUser] = useLoginMutation();

  const [checkfirstWelcomeApi] = useCheckFirstSeeWelcomeDataMutation();

  const [formData, setFormData] = useState({ login: "", password: "", role: "" });
  const [utFUserId] = useState({userId:''});

  const fCheckfirstWelcome = async () => {
    utFUserId.userId = localStorage.getItem('userId')||'0';

    try {

      const response = await checkfirstWelcomeApi(utFUserId).unwrap();

      if (response.welcomepage === 'Yes')
      {
        return true;
      }
      else
      {
        return false;
      }

    }
    catch (error)
    {
      return null;
    }

  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const login = async () => {
    
    try {
      const response = await loginUser(formData).unwrap();

      const user: VitaUser = {
        id: response.id.toString(), // Преобразовываем id в строку
        login: response.login,
        role: response.role
        // Другие свойства
      };


      dispatch(setUser(user));

      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('role', user.role);
      localStorage.setItem('userId',user.id);
      localStorage.setItem('login',user.login);


      const vCheck = await fCheckfirstWelcome();

      if (user.role === 'undefined')
      {
        navigate("/form");
      }
      else if (user.role === 'Patient')
      {
        if (vCheck)
        {
          navigate('/main/P/lk');
        }
        else
        {
          navigate('/WelcomePage');
        }
        
      }
      else if (user.role === 'Doctor')
      {
        if (vCheck)
        {
          navigate('/main/D/lk');
        }
        else
        {
          navigate('/WelcomePage');
        }
      }

    } catch (err) {
      const maybeError = isErrorWithMessage(err);

      if (maybeError) {
        setError(err.data.message);
      } else {
        setError("Нет соединение до Сервера!");
      }
    }
  };

  const registerPage = () => {
    navigate("/register");
  };
 
  const landingPage = () => {
    window.location.href = 'https://vitaent.ru';
  }

  return (
    <div className="d-flex align-items-center justify-content-center" style={containerStyles}>
      <div style={containerAuth}>
          <div className='d-flex flex-column'>
          <span style={sp_1}>Добро пожаловать!</span>
          <span style={sp_2}>Для входа введите Логин и Пароль</span>
          </div>
          <div>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Control name="login" type="text" placeholder="Логин" style={log_in} value={formData.login} onChange={handleInputChange}/>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Control name="password" type="password" placeholder="Пароль" style={pass_in} value={formData.password} onChange={handleInputChange}/>
          </Form.Group>
          </div>
          <div style={{ display: "flex",
                        flexDirection: "column",
                        height: "150px",
                        justifyContent: "space-around"
                      }}>
          <Button variant="primary" style={b_login} onClick={() => login()}>
            Войти
          </Button>
          <Button variant="primary" style={b_login} onClick={registerPage}>
            Зарегистрироваться
          </Button>
          <Button variant="primary" style={b_login} onClick={landingPage}>
            Назад
          </Button>
          </div>
          <ErrorMessage message={error} />
      </div>
    </div>
  );
};

export default LoginForm;
