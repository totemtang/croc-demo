let qHighText = String.raw`         Select c_custkey, c_acctbal
          From Customer
          where Customer.c_acctbal >
            (Select avg(c_acctbal)
            From Customer);
      `;
let q17Text = String.raw`select
	sum(l_extendedprice) / 7.0 as avg_yearly
from
	lineitem,
	part, 
    (
        select l_partkey as agg_partkey , 0.2 * avg(l_quantity) as agg_avg
        from lineitem
        group by l_partkey
    ) as agg_l 
where
  p_partkey = l_partkey
  and p_partkey = agg_partkey
  and l_quantity < agg_avg
  and p_brand = 'Brand#23'
  and p_container = 'MED BOX';
`;
// let qHighText = "SELECT * FROM table1";

function showQueryText() {
  var queryName = document.getElementById("query").value;
  if (queryName.localeCompare("Q-HighCustBal") === 0) {
    document.getElementById("queryText").value = qHighText;
  } else if (queryName.localeCompare("Q-17") === 0) {
    document.getElementById("queryText").value = q17Text;
  } else {
    document.getElementById("queryText").value = "Not supported";
  }
}
