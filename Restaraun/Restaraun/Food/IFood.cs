using Restaraun.Packing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Restaraun.Food
{
    public interface IFood
    {
        public string name();
        public int calories();
        public IPacking packing();
        public double price();
    }
}
