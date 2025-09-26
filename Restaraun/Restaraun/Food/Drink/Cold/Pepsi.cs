using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Restaraun.Food.Drink.Cold
{
    public class Pepsi : ColdDrink
    {
        private BeverageSize beverageSize;
        public Pepsi(BeverageSize beverageSize) : base(beverageSize)
        {
        }

        public override int calories()
        {
            switch (beverageSize)
            {
                case BeverageSize.Small:
                    {
                        return 210;
                        break;
                    }
                case BeverageSize.Large:
                    {
                        return 220;
                        break;
                    }
                case BeverageSize.Medium:
                    {
                        return 230;
                        break;
                    }
                case BeverageSize.ExtraSmall:
                    {
                        return 200;
                        break;
                    }


            }
            return 0;
        }

        public override string name()
        {
            return "Pepsi" + DrinkDetails();
        }

        public override double price()
        {
            switch (beverageSize)
            {
                case BeverageSize.Small:
                    {
                        return 1.8d;
                        break;
                    }
                case BeverageSize.Large:
                    {
                        return 2.0d;
                        break;
                    }
                case BeverageSize.Medium:
                    {
                        return 2.2d;
                        break;
                    }
                case BeverageSize.ExtraSmall:
                    {
                        return 2.4d;
                        break;
                    }


            }
            return 0d;
        }
    }
}

