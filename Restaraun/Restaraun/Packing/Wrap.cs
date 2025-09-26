using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Restaraun.Packing
{
    public class Wrap:IPacking
    {
        public string pack()
        {
            return "Wrap";
        }

        public double packingPrice()
        {
            return 0.4d;
        }
    }
}
