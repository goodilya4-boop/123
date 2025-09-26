using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Restaraun.Food.Drink.Cold
{
    public class Cocola : ColdDrink
    {
        private BeverageSize beverageSize;
        public Cocola(BeverageSize beverageSize) : base(beverageSize)
        {
        }

        public override int calories()
        {
            switch (beverageSize)
            {
                case BeverageSize.Small:
                    {
                        return 110;
                        break;
                    }
                case BeverageSize.Large:
                    {
                        return 120;
                        break;
                    }
                case BeverageSize.Medium:
                    {
                        return 130;
                        break;
                    }
                case BeverageSize.ExtraSmall:
                    {
                        return 100;
                        break;
                    }
                    
                    
            }
            return 0;
        }

        public override string name()
        {
            return "Coca-cola"+ DrinkDetails();
        }

        public override double price()
        {
            switch (beverageSize)
            {
                case BeverageSize.Small:
                    {
                        return 0.8d;
                        break;
                    }
                case BeverageSize.Large:
                    {
                        return 1.0d;
                        break;
                    }
                case BeverageSize.Medium:
                    {
                        return 1.2d;
                        break;
                    }
                case BeverageSize.ExtraSmall:
                    {
                        return 1.4d;
                        break;
                    }


            }
            return 0d;
        }
    }
}
