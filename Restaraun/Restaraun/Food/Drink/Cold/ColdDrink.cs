using Restaraun.Packing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Restaraun.Food.Drink.Cold
{
    public abstract class ColdDrink : Drink
    {
        public ColdDrink(BeverageSize beverageSize) : base(beverageSize)
        {
        }
        public override IPacking packing()
        {
            return new Bottle();
        }
    }

}
