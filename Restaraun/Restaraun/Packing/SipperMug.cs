using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Restaraun.Packing
{
    public class SipperMug:IPacking
    {
        public string pack()
        {
            return "Sipper Mug";
        }

        public double packingPrice()
        {
            return 1.6d;
        }
    }
}
