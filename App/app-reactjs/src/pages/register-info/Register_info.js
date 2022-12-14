import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ButtonAuthen from "../../components/button/ButtonAuthen";
import ButtonSocial from "../../components/button/ButtonSocial";
import InputAuthen from "../../components/input/InputAuthen";
import axiosClients from "../../api/axiosClient";
import "./Register_info.scss";
import { info, login, registerInfo } from "../../store/userSlice";
import { useDispatch, useSelector } from "react-redux";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register_info = (props) => {
  const [name, setName] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [gender, setGender] = useState("");
  const [bio, setBio] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userRegister = useSelector((state) => state.user.user);
  useEffect(() => {
    if (userRegister) {
      toast.success("Đăng kí thành công");
    }
  }, [userRegister]);
  const username = userRegister.username;
  const password = userRegister.password;
  const submitHandle = () => {
    console.log("userRegister", userRegister);

    const user = {
      username,
      name,
      birthDate: birthDay,
      gender,
      bio,
    };
    dispatch(registerInfo({ user })).then((res) => {
      if (res.payload.status === 200) {
        // Đăng kí thành công

        dispatch(login({ username, password })).then((res) => {
          console.log("res.payload", res.payload);
          if (res.payload.status !== 200) {
            return;
          }
          navigate("/profile");
        });
      } else {
        // Đăng kí thất bại
      }
    });
  };
  const skipHandle = () => {
    const user = {
      username,
      name,
      birthDate: birthDay,
      gender,
      bio,
    };
    dispatch(registerInfo({ user })).then((res) => {
      if (res.payload.status === 200) {
        // Đăng kí thành công
        dispatch(login({ username, password })).then((res) => {
          if (res.payload.status !== 200) {
            return;
          }
          navigate("/profile");
        });
      } else {
        // Đăng kí thất bại
      }
    });
  };

  const changeNameHandle = (value) => {
    setName(value);
  };
  const changeBirthDayHandle = (value) => {
    setBirthDay(value);
  };

  const changeBioHandle = (value) => {
    setBio(value);
  };

  return (
    <div className="login">
      <ToastContainer />
      <div className="login__container">
        <div className="login__title">
          <h3 className="login__title__main">Thông tin tài khoản</h3>
          <p className="login__title__sub">
            Cập nhật tài khoản SUARCHAT miễn phí của bạn ngay bây giờ.
          </p>
        </div>
        <div className="login__input">
          <InputAuthen
            label="Họ và tên"
            type="text"
            placeholder="Nhập vào họ tên"
            onInput={changeNameHandle}
          />

          <InputAuthen
            label="Ngày sinh"
            type="text"
            isDateTime
            onInput={changeBirthDayHandle}
          />

          <label className="input-authen__label">Giới tính</label>
          <select
            className="input-authen__input"
            onChange={(option) => setGender(option.target.value)}
            name="gender"
          >
            <option value="">Chọn giới tính</option>
            <option value="female">Nữ</option>
            <option value="male">Nam</option>
            <option value="other">Khác</option>
          </select>

          <InputAuthen
            label="Mô tả bản thân"
            type="text"
            placeholder="Nhập mô tả bản thân"
            onInput={changeBioHandle}
          />

          <div className="button_authen__wrapper">
            <ButtonAuthen content="Cập nhật" onClick={submitHandle} />
          </div>

          <div className="button_authen__wrapper">
            <ButtonAuthen isSkip content="Bỏ qua >>" onClick={skipHandle} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Register_info;
