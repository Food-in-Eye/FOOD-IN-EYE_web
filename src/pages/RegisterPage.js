import Register from "../css/Register.module.css";
import Button from "../css/Button.module.css";
import { postUser } from "../components/API.module";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import littleLogo from "../images/little-logo.png";
import mainLogo from "../images/foodineye.png";

function RegisterPage() {
  const navigate = useNavigate();

  const [id, setId] = useState("");
  const [passwd, setPasswd] = useState("");
  const [passwdCheck, setPasswdCheck] = useState("");

  const [isIdDuplicate, setIsIdDuplicate] = useState(false);
  const [isValidPasswd, setIsValidPasswd] = useState(false);
  const [isPasswdMatch, setIsPasswdMatch] = useState(false);

  const handleIdDuplicate = async (e) => {
    e.preventDefault();

    try {
      await postUser(`/signup/idcheck`, {
        id: id,
      }).then((res) =>
        res.data.response === "available"
          ? setIsIdDuplicate(false)
          : setIsIdDuplicate(true)
      );
    } catch (error) {
      console.error("Error checking ID duplicate:", error);
    }
  };

  const isPasswordValid = (password) => {
    // 비밀번호 조건: 8자리 이상, 대문자, 소문자, 특수문자 모두 포함
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordPattern.test(password);
  };

  const handlePasswdChange = (e) => {
    const newPasswd = e.target.value;
    setPasswd(newPasswd);
    setIsValidPasswd(isPasswordValid(passwd));
  };

  const handlePasswdCheck = (e) => {
    const newPasswdCheck = e.target.value;
    setPasswdCheck(newPasswdCheck);
    setIsPasswdMatch(newPasswdCheck === passwd);
  };

  const onRegister = async (e) => {
    e.preventDefault();

    if (!isIdDuplicate && isValidPasswd && isPasswdMatch) {
      try {
        await postUser(`/signup/seller`, {
          id: id,
          pw: passwd,
        }).then((res) => console.log(res));
      } catch (error) {
        console.error("Error registering:", error);
      }

      navigate(`/`);
    } else {
      alert("회원가입 조건을 만족하지 않습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className={Register.container}>
      <div className={Register.halfCircle}>
        <img className={Register.mainLogo} src={mainLogo} alt="foodineye" />
        <div>
          <p>Let's</p>
          <p>Get</p>
          <p>Start!</p>
        </div>
      </div>
      <img className={Register.littleLogo} src={littleLogo} alt="little-logo" />
      <section className={Register.RegisterForm}>
        <form>
          <div className={Register.firstSection}>
            <section className={Register.IDSection}>
              <label htmlFor="id">
                ID
                <input
                  id="id"
                  type="text"
                  name="id"
                  placeholder="ID"
                  onChange={(e) => {
                    setId(e.target.value);
                  }}
                  style={{
                    width: "350px",
                    border: !isIdDuplicate && id ? "2px solid #52bf8b" : "",
                  }}
                />
              </label>
              <button
                className={Button.duplicateCheck}
                onClick={handleIdDuplicate}
              >
                ID 중복 확인
              </button>
            </section>
            {isIdDuplicate && id ? (
              <p style={{ color: "#B9062F" }}>이미 사용 중인 ID입니다.</p>
            ) : (
              id && <p>사용 가능한 ID입니다.</p>
            )}
          </div>
          <div className={Register.secondSection}>
            <section className={Register.PasswdSection}>
              <label htmlFor="password">
                비밀번호
                <input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="비밀번호는 8자리 이상, 특수문자, 영문자 소문자와 대문자 모두 포함이어야 합니다."
                  onChange={handlePasswdChange}
                  style={{
                    width: "600px",
                    border: isValidPasswd && passwd ? "2px solid #52bf8b" : "",
                  }}
                />
              </label>
            </section>
            {!isValidPasswd && passwd ? (
              <p style={{ color: "#B9062F" }}>
                비밀번호는 8자리 이상, 특수문자, 영문자 소문자와 대문자 모두
                포함이어야 합니다.
              </p>
            ) : (
              passwd && <p>사용 가능한 비밀번호 입니다.</p>
            )}
          </div>
          <div className={Register.thirdSection}>
            <section className={Register.PasswdCheckSection}>
              <label htmlFor="password-check">
                비밀번호 확인
                <input
                  id="password-check"
                  type="password"
                  name="passwordCheck"
                  placeholder="비밀번호 확인"
                  onChange={handlePasswdCheck}
                  style={{
                    width: "600px",
                    border:
                      isPasswdMatch && passwdCheck ? "2px solid #52bf8b" : "",
                  }}
                />
              </label>
            </section>
            {!isPasswdMatch && passwdCheck ? (
              <p style={{ color: "#B9062F" }}>
                비밀번호와 동일하지 않습니다. 다시 한번 입력해주세요.
              </p>
            ) : (
              passwdCheck && <p>비밀번호와 동일합니다.</p>
            )}
          </div>
          <button className={Button.register} onClick={onRegister}>
            회원가입 하기
          </button>
        </form>
      </section>
    </div>
  );
}

export default RegisterPage;
