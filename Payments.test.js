const { expect } = require("chai")
const { ethers } = require("hardhat")




describe("Payments", function () { описывать что-то - смарт контракт
  let acc1
  let acc2 //обьявляем переменные к-е потом будем вытаскивать
  let payments





  beforeEach(async function() { // перед тестом делаем действия:  асинхрон анон функ
    //await - //т.к. операция может потребовать какое-то время т.е. не мгновенная
    [acc1, acc2] = await ethers.getSigners() //получаем инфу о бета акках, вытаскиваем 2акка из 20ти, сайнер (сигнерс) акки к-е будут патписывать
    const Payments = await ethers.getContractFactory("Payments", acc1) //получаем инфу о скомпилированной версии компиляция  acc1- от имени кого будем разворачивать    
    payments = await Payments.deploy()  //отправляем, а точнее ждем пока транза будет отправлена         в этой переменной сохраним спе обьект с к-м будем заимодействовать
    await payments.deployed() //ждем пока транза будет выполнена 
    //console.log(payments.address)
  })






    //каждый отдельны тест делает 1фичу, однумаленькую часть
//BLOCK beforeEach будет выполнятся перед каждым it тестом имея свежий контракт, т.к. тесты должны быть изолированы и не зависить один от другого
  it("should be deployed", async function() {
     //console.log('success!')
    expect(payments.address).to.be.properAddress  //проверка что адрес развернутоого см корректен с помощью waffle doc - chai matchers
  })





  it("should have 0 ether by default", async function() {//проверим что балик изначально == 0
    const balance = await payments.currentBalance()
     //console.log(balance)
    expect(balance).to.eq(0)
  })






//он потом это все удалил!   здесь от первого акка транза в контракт со 100веями
  it("should be possible to send funds", async function() {
    const tx = payments.pay('Salam aleikum vsem nashim',{ value: 100})
    await tx.wait()

    const balance = await payments.currentBalance()
    console.log(balance)
  })




  it("should be possible to send funds", async function() {//отправляем денежки с помощью функции Пэй!
    const sum = 100
    const msg = "hello from hardhat"




    //connect(acc2) теперь от второго акка
    const tx = await payments.connect(acc2).pay(msg, { value: sum })//переменная транзакции
    await expect(() => tx) (передает нашу транзу в созданную анон функцию)
      //.to.changeEtherBalances(acc2, -100)проверка что на 100вей меньше
      .to.changeEtherBalances([acc2, payments], [-sum, sum]);//проверка что балик меняется на нескольких счетах( тут на двух) https://ethereum-waffle.readthedocs.io/en/latest/matchers.html#change-ether-balance-multiple-accounts

    await tx.wait()




//почему не newPayment.wait() - пушто будет отправлено не как транза а как вызов
    const newPayment = await payments.getPayment(acc2.address, 0)//инфу о конкретном платеже (откуда, индекс транзы)
    //console.log(newPayment) (amount timestamp from messege)


    expect(newPayment.message).to.eq(msg) //correct сообщение
    expect(newPayment.amount).to.eq(sum)  //проверка на корректную сумму
    expect(newPayment.from).to.eq(acc2.address) //корректный адрес?
  })
})

//попробовать самомсчтоятльно написать несколько тестов!!!!!