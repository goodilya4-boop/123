using Restaraun.Food;
using Restaraun.Food.Drink;
using Restaraun.Food.Drink.Cold;
using Restaraun.Food.Nagets;
using static Restaraun.Order;

namespace Restaraun
{
    public class OrderBuilder
    {
        private static double HAPPY_MENU_DISCOUNT = 0.5d;
        private string customerName;
        private OrderService service = OrderService.Out;
        private List<IFood> _foods = new List<IFood>();
        public OrderBuilder()
        {

        }

        public OrderBuilder name(string customerName)
        {
            this.customerName = customerName;
            return this;
        }
        public OrderBuilder item(IFood food)
        {
            _foods.Add(food);
            return this;
        }
        public OrderBuilder serviceOrder(OrderService service)
        {
            if (service != null)
            {
                this.service = service;
                
            }
            return this;
            //return service;
        }
        public OrderBuilder vegNuggetsHappyMeal()
        {
            List<IFood> foods = new List<IFood>();
            foods.Add(new CheezeNuggets());
            foods.Add(new Pepsi(BeverageSize.Medium));
            Meal meal = new Meal( foods, "Veg Nuggets Happy Meal", HAPPY_MENU_DISCOUNT);
            return item(meal);
        }
        public OrderBuilder chickenNuggetsHappyMeal()
        {
            List<IFood> foods = new List<IFood>();
            foods.Add(new ChickenNuggets());
            foods.Add(new Cocola(BeverageSize.Medium));
            Meal meal = new Meal(foods, "Cheeze Nuggets Happy Meal", HAPPY_MENU_DISCOUNT);
            return item(meal);
        }
        public Order build()
        {
            Order order = new Order(_foods, customerName, service);
            if (!validOrder())
            {
                Console.WriteLine("Sorry");
            }
            return order;
        }
        private bool validOrder()
        {
            return ((service!=null)&& !(_foods.Count ==0));
        }
    }
}
