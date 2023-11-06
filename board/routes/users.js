const express = require("express");
const { Users, UserInfos } = require("../models");
const router = express.Router();
const jwt = require('jsonwebtoken');

//회원가입
router.post("/users", async (req, res) => {
    const { nickname, password, name, confirmPassword } = req.body;
    const isExistUser = await Users.findOne({ where : { nickname } });

    if(!/^[A-Za-z0-9]{3,10}$/.test(nickname)) {
        return res.status(400).json({ message: "닉네임 형식이 올바르지 않습니다." });
    }

    if(isExistUser) {
        return res.status(409).json({ message : "중복된 닉네임입니다." });
    }

    if(!/^.{4,10}$/.test(password)) {
        return res.status(400).json({ message : "비밀번호는 4자리에서 10자리 사이여야합니다." });
    }

    if(new RegExp(nickname).test(password)) {
        return res.status(409).json({ message : "비밀번호에 닉네임을 포함할 수 없습니다." });
    }

    if(password !== confirmPassword) {
        return res.status(401).json({ message: "비밀번호가 일치하지 않습니다" });
    }

    //Users 테이블에 사용자 추가
    const user = await Users.create({ nickname, password });

    //UsersInfo 테이블에 사용자 추가
    const userInfo = await UserInfos.create({
        userId: user.userId,
        name
    });

    return res.status(201).json({ message: "회원가입이 완료되었습니다." });
});

//로그인
router.post("/login", async (req, res) => {
    const { nickname, password } = req.body;
    const user = await Users.findOne({ where: { nickname } });

    if(!user || user.password !== password) {
        return res.status(401).json({ message: "닉네임 또는 패스워드를 확인해주세요." });
    }

    const token = jwt.sign({
        userId: user.userId
    }, "customized_secret_key");
    res.cookie("authorization", `Bearer ${token}`);
    return res.status(200).json({ message: "로그인 성공!" });
    
});

module.exports = router;