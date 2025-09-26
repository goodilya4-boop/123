// See https://aka.ms/new-console-template for more information
using Restaraun;
using Restaraun.Food;
using Restaraun.Food.Burger;
using Restaraun.Food.Drink;
using Restaraun.Food.Drink.Cold;
using Restaraun.Food.Drink.Hot;
using Restaraun.Food.Nagets;
using System.Collections.Generic;
using System;

List<IFood> list = new List<IFood>();
list.Add(new ChickenBurger());
list.Add(new VegBurger());
list.Add(new ChickenNuggets());
list.Add(new ChickenNuggets());
list.Add(new Cocola((Restaraun.Food.Drink.BeverageSize)new Random().Next(0, 3)));
list.Add(new Pepsi((Restaraun.Food.Drink.BeverageSize)new Random().Next(0, 3)));
list.Add(new Cappuccino((Restaraun.Food.Drink.BeverageSize)new Random().Next(0, 3)));
list.Add(new HotChocolate((Restaraun.Food.Drink.BeverageSize)new Random().Next(0, 3)));

OrderBuilder builder = new OrderBuilder();
Order meal = builder.name("Vera").item(new ChickenBurger()).item(new Cappuccino(Restaraun.Food.Drink.BeverageSize.Large)).serviceOrder(Order.OrderService.In).build();
BillPrinter billPrinter = new BillPrinter();
billPrinter.printItemsedBill(meal);
Console.WriteLine("Вы счастливчик! Ваш подарок");
Order present = builder.name("Vera").item((IFood)list[(new Random().Next(0, 3))]).item((IFood)list[new Random().Next(4, 7)]).serviceOrder(Order.OrderService.Out).build();
billPrinter.printItemsedBill(present);

OrderBuilder builderIvan = new OrderBuilder();
Order ivan = builderIvan.name("Ivan").vegNuggetsHappyMeal().serviceOrder(Order.OrderService.In).build();
billPrinter.printItemsedBill(ivan);