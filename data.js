// Chandigarh sector price history, Rs per sq.yd (shown on site per sq.ft = value/9). Illustrative trend, 2018-2026
const SECTORS = {
"Sec 8": {zone:"North", base:185000, growth:0.071, trend:[98000,105000,112000,125000,138000,152000,168000,178000,185000]},
"Sec 9": {zone:"North", base:210000, growth:0.075, trend:[112000,120000,129000,143000,158000,175000,192000,201000,210000]},
"Sec 17": {zone:"Commercial", base:245000, growth:0.068, trend:[135000,143000,152000,168000,185000,205000,224000,235000,245000]},
"Sec 22": {zone:"Central", base:148000, growth:0.082, trend:[74000,81000,89000,101000,113000,126000,137000,142000,148000]},
"Sec 34": {zone:"South", base:132000, growth:0.089, trend:[62000,69000,77000,89000,101000,113000,122000,127000,132000]},
"Sec 35": {zone:"South", base:165000, growth:0.084, trend:[83000,91000,100000,114000,128000,142000,154000,160000,165000]},
"Sec 44": {zone:"South", base:118000, growth:0.093, trend:[54000,61000,69000,81000,93000,104000,110000,114000,118000]},
"Sec 15": {zone:"East", base:98000, growth:0.088, trend:[47000,53000,60000,70000,80000,89000,93000,95500,98000]},
"Mohali Rd": {zone:"Greater", base:72000, growth:0.104, trend:[31000,36000,42000,50000,58000,64000,68000,70000,72000]},
"Zirakpur": {zone:"Greater", base:58000, growth:0.112, trend:[23000,27000,32000,39000,46000,51000,54500,56200,58000]}
};
const YEARS = [2018,2019,2020,2021,2022,2023,2024,2025,2026];
const DEALERS_SEED = [
{id:"d1", name:"Goyal Properties", owner:"Rajesh Goyal", area:"Sector 34", phone:"9814011223", deals:142, rating:4.8, exp:"12 yrs", spl:"Residential plots", rera:"RERA-CHD-2019-0142"},
{id:"d2", name:"Chawla Estates", owner:"Simran Chawla", area:"Sector 22", phone:"9815044556", deals:98, rating:4.6, exp:"9 yrs", spl:"SCO / Commercial", rera:"RERA-CHD-2020-0311"},
{id:"d3", name:"UT Land Hub", owner:"Vikram Sethi", area:"Sector 17", phone:"9815577889", deals:210, rating:4.9, exp:"15 yrs", spl:"Premium sectors", rera:"RERA-CHD-2018-0087"},
{id:"d4", name:"Green Acres", owner:"Harpreet Gill", area:"Zirakpur", phone:"9816033445", deals:76, rating:4.4, exp:"6 yrs", spl:"Budget plots / Flats", rera:"RERA-PB-2021-1104"},
{id:"d5", name:"CityNest Realty", owner:"Anjali Sharma", area:"Sector 35", phone:"9816066778", deals:64, rating:4.5, exp:"7 yrs", spl:"Houses / Rentals", rera:"RERA-CHD-2021-0520"}
];
const LISTINGS_SEED = [
{id:"p1", title:"2250 sq.ft E-facing plot, Sector 35", sector:"Sec 35", price:41250000, type:"Plot", area:2250, by:"Goyal Properties", phone:"9814011223", tag:"Verified"},
{id:"p2", title:"1620 sq.ft park-facing house, Sector 22", sector:"Sec 22", price:26640000, type:"House", area:1620, by:"Chawla Estates", phone:"9815044556", tag:"Verified"},
{id:"p3", title:"SCO 1080 sq.ft, Sector 17-E", sector:"Sec 17", price:29400000, type:"Commercial", area:1080, by:"UT Land Hub", phone:"9815577889", tag:"Hot"},
{id:"p4", title:"4500 sq.ft gated plot, Zirakpur", sector:"Zirakpur", price:29000000, type:"Plot", area:4500, by:"Green Acres", phone:"9816033445", tag:"New"},
{id:"p5", title:"2700 sq.ft corner plot, Mohali Rd", sector:"Mohali Rd", price:21600000, type:"Plot", area:2700, by:"Green Acres", phone:"9816033445", tag:"Verified"},
{id:"p6", title:"1350 sq.ft duplex, Sector 44", sector:"Sec 44", price:17700000, type:"House", area:1350, by:"CityNest Realty", phone:"9816066778", tag:"New"}
];
const DEMANDS_SEED = [
{name:"Rohit", phone:"98111-22334", budget:"Rs 60-80L", budgetNum:7000000, loc:"Zirakpur", type:"Plot", note:"1800-2700 sq.ft, ready papers"},
{name:"Meera", phone:"98222-33445", budget:"Rs 1.2-1.5Cr", budgetNum:13500000, loc:"Sec 44", type:"House", note:"Loan approved, shift in 3 months"}
];
