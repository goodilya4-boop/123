using Restaraun.Packing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Restaraun.Food.Drink
{
    public enum BeverageSize
    {
        ExtraSmall,
        Small,
        Medium,
        Large
    }
    public abstract class Drink : IFood
    {
        private BeverageSize _size;
        protected Drink(BeverageSize beverageSize) 
        {
            this._size = beverageSize;
            switch (beverageSize)
            {
                case BeverageSize.ExtraSmall: { break; }
                    case BeverageSize.Small: { break; }
                    case BeverageSize.Medium: { break; }
                    case BeverageSize.Large: { break; }
                    default: break;
            }
        }
        public string DrinkDetails()
        {
            return _size.ToString();
        }
        public abstract int calories();
        public abstract string name();
        public abstract IPacking packing();
        public abstract double price();
    }
}
