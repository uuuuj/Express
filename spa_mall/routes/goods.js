// routes/goods.js
// /routes/goods.js

const express = require('express');
const router = express.Router();
const Goods = require("../schemas/goods");
const cart = require("../schemas/cart")

// /routes/goods.js
const goods = [
    {
      goodsId: 4,
      name: "상품 4",
      thumbnailUrl:
        "https://cdn.pixabay.com/photo/2016/09/07/02/11/frogs-1650657_1280.jpg",
      category: "drink",
      price: 0.1,
    },
    {
      goodsId: 3,
      name: "상품 3",
      thumbnailUrl:
        "https://cdn.pixabay.com/photo/2016/09/07/02/12/frogs-1650658_1280.jpg",
      category: "drink",
      price: 2.2,
    },
    {
      goodsId: 2,
      name: "상품 2",
      thumbnailUrl:
        "https://cdn.pixabay.com/photo/2014/08/26/19/19/wine-428316_1280.jpg",
      category: "drink",
      price: 0.11,
    },
    {
      goodsId: 1,
      name: "상품 1",
      thumbnailUrl:
        "https://cdn.pixabay.com/photo/2016/09/07/19/54/wines-1652455_1280.jpg",
      category: "drink",
      price: 6.2,
    },
  ];
//end point 작성
// routes/goods.js

// localhost:3000/api/ GET
router.get("/", (req, res) => {
    res.send("default url for goods.js GET Method");
  });
  
// localhost:3000/api/about GET
router.get("/about", (req, res) => {
res.send("goods.js about PATH");
});

//상품 목록 조회 API
router.get("/goods", (req, res) => {
	res.json({ goods: goods });
});

//상품 상세 조회 API
router.get("/goods/:goodsId", (req, res) => {
	const { goodsId } = req.params;
	const [detail] = goods.filter((goods) => goods.goodsId === Number(goodsId));
	res.json({ detail });
});

router.post("/goods/:goodsId/cart", async (req, res) => {
  const { goodsId } = req.params;   //url에서 goodsId 값을 추출한다
  const { quantity } = req.body;    //요청 본문에서 quantity 값을 추출한다

  const existCarts = await cart.find({ goodsId: Number(goodsId)});    //데이터 베이스에서 해당 goodsId를 가진 항목이 장바구니에 이미 있는지 확인한다
  if(existCarts.length) {
    return res.json({success: false, errorMessage: "이미 장바구니에 존재하는 상품입니다."});
  }

  await cart.create({goodsId: Number(goodsId), quantity: quantity});  //장바구니에 해당 상품을 추가한다. 여기서 상품 ID와 수량을 데이터 베이스에 저장한다

  res.json({result: "success"});
});

router.post("/goods", async (req, res) => {
	const { goodsId, name, thumbnailUrl, category, price } = req.body;

  const goods = await Goods.find({ goodsId });
  if (goods.length) {
    return res.status(400).json({ success: false, errorMessage: "이미 있는 데이터입니다." });
  }

  const createdGoods = await Goods.create({ goodsId, name, thumbnailUrl, category, price });

  res.json({ goods: createdGoods });
});

router.put("/goods/:goodsId/cart", async (req, res) => {
  const { goodsId } = req.params;
  const { quantity } = req.body;

  const existCarts = await cart.find({ goodsId: Number(goodsId)});
  if(existCarts.length) {
    if(quantity < 1) {
      return res.status(400).json({ success: false, errorMessage: "1미만으로 수정할 수 없습니다."});
    }
    else {
      await cart.updateOne({goodsId : Number(goodsId)}, { $set: {quantity}});
    }
  }
  res.json({ success: true});
})

router.delete("/goods/:goodsId/cart", async (req, res) => {
  const { goodsId } = req.params;

  const existCarts = await cart.find({ goodsId });
  if(existCarts.length > 0) {
    await cart.deleteOne({goodsId});
  }
  res.json({result: "success"});
});

// 장바구니 조회 API
// async : 주어진 작업을 백그라운드에서 실행하고, 완료되면 나중에 알려준다.
router.get("/goods/cart", async (req, res) => {
  const carts = await cart.find({});
  const goodsIds = carts.map((cart) => cart.goodsId);

  const goods = await Goods.find({ goodsId: goodsIds });

  const results = carts.map((cart) => {
    return {
      quantity: cart.quantity,
      goods: goods.find((item) => item.goodsId === cart.goodsId)
    };
  });

  res.json({
    carts: results,
  });
});
//작성한 Router를 app.js에서 사용하기 위해 내보내주는 코드
//다른 파일에서 사용할 수 있게된다.
module.exports = router;

//이제부터 http://localhost:3000/ 뒤에 /api로 시작되는 주소는 routes/goods.js에 있는 Router 미들웨어를 통해 처리된다.

