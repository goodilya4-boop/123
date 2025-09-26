using Restaraun.Packing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Restaraun.Food.Drink.Hot
{
    public abstract class HotDrink : Drink
    {
        public HotDrink(BeverageSize beverageSize) : base(beverageSize)
        {
        }
        public override IPacking packing()
        {
            return new SipperMug();
        }
    }
}
