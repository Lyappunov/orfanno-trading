import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.css";
import './index.scss'
import '../index.css'
import TradingViewChart from '../../components/TradingViewChart'
import TransactionList from '../../components/TransactionList'
// import LeftSideBar from '../../components/LeftSideBar/LeftSideBar'

import {options} from '../../global/tv'

// function generalDateRange(){
//   var range=[]
//   var today = new Date();
//   var thisyear = today.getFullYear();
//   var lastyear = thisyear
//   var thisMonth = today.getMonth()<10?'0'+(today.getMonth() + 1):(today.getMonth() + 1)
//   var lastMonth = today.getMonth()<10?'0'+(today.getMonth()):(today.getMonth())
//   if(thisMonth == '01'){
//     lastMonth = '12'
//     lastyear = thisyear - 1
//   }
//   var thisDay = today.getDate()<10?'0'+(today.getDate()):today.getDate();
//   var thisMonthToday = thisyear+'-'+thisMonth+'-'+thisDay
//   var lastMonthToday = lastyear+'-'+lastMonth+'-'+thisDay
//   var Hours = today.getHours()<10?'0'+today.getHours():today.getHours()
//   var Minutes = today.getMinutes()<10?'0'+today.getMinutes():today.getMinutes()
//   var Seconds = today.getSeconds()<10?'0'+today.getSeconds():today.getSeconds();
//   var time = Hours+ ":" + Minutes + ":" + Seconds
//   var fromDateTime = lastMonthToday + 'T' + time + 'Z'
//   var toDateTime = thisMonthToday + 'T' + time + 'Z'
//   range.push(fromDateTime)
//   range.push(toDateTime)
//   return range
// }

function generalDateRange(){
  var range=[]
  var today = new Date();
  var thisyear = today.getFullYear();
  var lastyear = thisyear
  var beforeDay = parseInt(today.getDate()) - 15;
  var thisMonth = today.getMonth()<10?'0'+(today.getMonth() + 1):(today.getMonth() + 1)
  var lastMonth = thisMonth
  if(beforeDay<=0)
   lastMonth = today.getMonth()<10?'0'+(today.getMonth()):(today.getMonth())
  if(thisMonth == '01'){
    lastMonth = '12'
    lastyear = thisyear - 1
  }
  
  var thisDay = today.getDate()<10?'0'+(today.getDate()):today.getDate();
  var lastDay = (beforeDay<10)?'0'+beforeDay:beforeDay
  if(beforeDay<=0)lastDay = 30 + beforeDay
  var thisMonthToday = thisyear+'-'+thisMonth+'-'+thisDay
  var lastMonthToday = lastyear+'-'+lastMonth+'-'+lastDay
  var Hours = today.getHours()<10?'0'+today.getHours():today.getHours()
  var Minutes = today.getMinutes()<10?'0'+today.getMinutes():today.getMinutes()
  var Seconds = today.getSeconds()<10?'0'+today.getSeconds():today.getSeconds();
  var time = Hours+ ":" + Minutes + ":" + Seconds
  var fromDateTime = lastMonthToday + 'T' + time + 'Z'
  var toDateTime = thisMonthToday + 'T' + time + 'Z'
  range.push(fromDateTime)
  range.push(toDateTime)
  return range
}
export const dateRangeGlobal = generalDateRange()


export function totalSupplyMethod(){
  return fetch('https://api.bscscan.com/api?module=stats&action=tokensupply&contractaddress=0xEF2ec90e0b8D4CdFdB090989EA1Bc663F0D680BF&apikey=1QDU4CXTNKVVM17EFW3XAENDYYA4JW4HME').then(res => {
    return res.json()
  }).then(json => {
    return json.result
  })
}

export function circulationSupplies(){
  return fetch('https://api.bscscan.com/api?module=stats&action=tokenCsupply&contractaddress=0xEF2ec90e0b8D4CdFdB090989EA1Bc663F0D680BF&apikey=1QDU4CXTNKVVM17EFW3XAENDYYA4JW4HME').then(res => {
    return res.json()
  }).then(json => {
    return json.result
  })
}

export function getTokenInfo(){
  return fetch('https://api.dex.guru/v1/tokens/0xef2ec90e0b8d4cdfdb090989ea1bc663f0d680bf-bsc').then(res => {
    return res.json()
  })
}

export function getBNBPrice(){
  return fetch('https://api.bscscan.com/api?module=stats&action=bnbprice&apikey=1QDU4CXTNKVVM17EFW3XAENDYYA4JW4HME').then(res => {
    return res.json()
  })
}

function App(){
  const [totalSupply, setTotalSupply] = useState(0)
  const [circulationSupply, setCirculationSupply] = useState(0)
  const [marketCap, setMarketCap] = useState(0);
  const [tokenInfo, setTokenInfo] = useState({});
  const [BNBPrice, setBNBPrice] = useState(0);
  const [completeFlg, setComponentFlg] = useState(false);
  
  const setComplete = () => {
    setComponentFlg(true)
  }
  const setNecessaryState = ()=>{
    if(completeFlg == true){
      
      totalSupplyMethod().then(tsr=>{
        setTotalSupply((tsr/Math.pow(10,9)))
      })
      circulationSupplies().then(cs=>{
        setCirculationSupply((cs/Math.pow(10,9)))
      })
      getTokenInfo().then(ti=>{
        setTokenInfo(ti)
      })
      getBNBPrice().then(bp=>{
        setBNBPrice(bp.result.ethusd)
      })
    }
  }
  useEffect(() => {

      const interval = setInterval(setNecessaryState, 2000);

      return () => clearInterval(interval);
    
  }, [completeFlg]);
  
  
  const getTheme = (val) => {
    console.log(val)
  }
  
    return (
      <div className="container" style={{ minWidth:'100%',backgroundColor:'#262626' }}>
        <header style={{ minWidth:'100%' }}>
          
          <a target="_blank" rel="noopener noreferrer" href="#">
            <img alt='Coin Panel Logo' lazy="true" src="./images/coinpanel.svg" />
            WEEKLY AIR DROPS
          </a>
        </header>
        <div className="row">
          <div className="col-md-2">
            <div>
              <ul >
                <li>
                      &nbsp;
                </li>
                <li>
                  <p>Total Supply:</p>
                  <p style={{ marginBottom:40 }}>{totalSupply.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                  <p>Market Cap:</p>
                  <p className="greenCharacter"><span>$</span>{(parseInt(parseFloat(totalSupply)*(parseFloat(tokenInfo.priceUSD).toFixed(15))/1.4107)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</p>
                </li>
                <li>
                  <p>ORFANO/BNB LP BNB Holdings:</p>
                  <p style={{ fontSize:15 }}>{(parseFloat(tokenInfo.liquidityUSD/BNBPrice).toFixed(2)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} BNB (<span className="greenCharacter">${(parseInt(tokenInfo.liquidityUSD)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}</span>)</p>
                  {/* <p>
                    <span>V1: 1,310.88 BNB (</span><span className="greenCharacter">$809,572</span><span>) | <a target="_blank" href="https://bscscan.com/token/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c?a=0x98dE283a561f76096B5C4df10C0C7f75A9fCb029#tokenAnalytics">Chart</a> </span><span>| <a target="_blank" href="https://bscscan.com/token/0x98dE283a561f76096B5C4df10C0C7f75A9fCb029#balances">Holders</a></span> 
                  </p>
                  <p>
                    <span>V2: 778.26 BNB (</span><span className="greenCharacter">$481,128</span><span>) | <a target="_blank" href="https://bscscan.com/token/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c?a=0x676Af01766b22760d9e9Ef9130C28AF0fbb2C17b#tokenAnalytics">Chart</a> </span><span>| <a target="_blank" href="https://bscscan.com/token/0x676Af01766b22760d9e9Ef9130C28AF0fbb2C17b#balances">Holders</a></span> 
                  </p> */}
                </li>
                <li>
                  <p>
                    <a target="_blank" href="https://bscscan.com/token/0xef2ec90e0b8d4cdfdb090989ea1bc663f0d680bf">
                      <img src="./images/logo-bscscan.svg" style={{height:25,maxWidth:25, objectFit: 'cover', objectPosition: '0 0'}}/>
                      &nbsp;ORFANO Transactions
                    </a>
                  </p>      
                </li>
                <li>
                  <p>
                    <a target="_blank" href="https://bscscan.com/address/0xef2ec90e0b8d4cdfdb090989ea1bc663f0d680bf#code">
                      <img src="./images/logo-bscscan.svg" style={{height:25, width:25,objectFit: 'cover', objectPosition: '0 0' }}/>
                      &nbsp;ORFANO Contract
                    </a>
                  </p>    
                </li>
                <li>
                  <p>
                    <a target="_blank" href="https://bscscan.com/token/0xef2ec90e0b8d4cdfdb090989ea1bc663f0d680bf#balances">
                      <img src="./images/logo-bscscan.svg" style={{height:25, width:25, objectFit: 'cover', objectPosition: '0 0' }}/>
                      &nbsp;ORFANO Holders
                    </a>
                  </p>    
                </li>
                <li>
                  <p>
                    <a target="_blank" href="https://explorer.bitquery.io/bsc/token/0xef2ec90e0b8d4cdfdb090989ea1bc663f0d680bf">
                      <img src="https://bitquery.io/wp-content/uploads/2020/09/bitquery_logo_w.png" style={{height:25, width:25, objectFit: 'cover', objectPosition: '0 0' }}/>
                      &nbsp;Bitquery Explorer
                    </a>
                  </p>    
                </li>
                <li>
                  <p>
                    <a href="#">
                      Rug Check
                    </a>
                  </p>    
                </li>
              </ul>
            </div>
          </div>
          <div className="col-md-10">
            <div className="row">
              <div className="col-md-4">
                <div style={{position:'relative',height:70}}>
                  <div style={{position:'absolute', top:10}}>
                      <img style={{width:40}} src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/0xEF2ec90e0b8D4CdFdB090989EA1Bc663F0D680BF/logo.png"/>
                  </div>
                  <div style={{position:'absolute',top:3, left:50}}>
                    <p style={{color:"white", fontSize:23, fontWeight:700}}>Orfano (ORFANO/BNB)</p>
                  </div>
                  <div style={{position:'absolute',top:27, left:50}}>
                    <p style={{color:"white", fontSize:18, fontWeight:500, textTransfrom:"upercase"}}>0xef2ec90e0b8d4cdfdb090989ea1bc663f0d680bf</p>
                  </div>
                </div>
              </div>
              <div className="col-md-8">
                <p style={{fontSize:28,fontWeight:700,color:'#1eff1e'}}>${tokenInfo==={}?0:(parseFloat(tokenInfo.priceUSD)/1.4107).toFixed(12)}</p>
              </div>
            </div>
            <div className="trading-chart" style={{ backgroundColor:'#262626' }}>
              <TradingViewChart cOptions={options} getTheme={getTheme} setFlg={setComplete}/>
            </div>
            <div className="trading-chart" style={{ backgroundColor:'#262626', width:'100%', maxHeight:460, marginTop:20}}>
              <TransactionList cOptions={options} callbackAction={setTotalSupply}/>
            </div>
          </div>
          
        </div>
          
      </div>
    )
  
}

export default App;