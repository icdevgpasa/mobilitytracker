<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return redirect('/admin');
});

Route::get('/stops', function() {
    $d = DB::table('przystanki')->get();
    return response()->json($d);
});
Route::get('/polygon/{mine}',function($mine) {
    if (!$mine) {
        $x = \App\Polygon::select('id','name','polygon')->get();

    } else {
        $x = \App\Polygon::select('id','name','polygon')->where('created_by','=',CRUDBooster::myId())->get();

    }
    foreach($x as $polygon) { $polygon->polygon = json_decode($polygon->polygon)[0];}
    return response()->json($x);
});
Route::post('/polygon', function(Request $request) {
    $name = $request->input('name');
    $polygon = json_encode($request->input('polygon')); 
    $markers = json_encode($request->input('markers'));
    $x = new \App\Polygon();
    $x->name = $name;
    $x->created_by = CRUDBooster::myId();
    $x->polygon = $polygon;
    $x->markers = $markers;
    $x->save();
    return response()->json(['status'=>'ok']);
});
Route::post('/data', function(Request $request) {
    $params = $request->all();
    $dateFrom = $request->input('dateFrom');
    $dateTo = $request->input('dateTo');
    $timeFrom = $request->input('timeFrom');
    $timeTo = $request->input('timeTo');
    $polygonFrom = $request->input('polygonFrom');
    $polygonTo = $request->input('polygonTo');
    $polygonFromObject= \App\Polygon::where('id','=',$polygonFrom)->first();
    $polygonToObject= \App\Polygon::where('id','=',$polygonTo)->first();
    $fromMarkers=(json_decode($polygonFromObject->markers));
    $toMarkers=(json_decode($polygonToObject->markers));
    $from = \App\Stop::select('shortname')->whereIn('id',$fromMarkers)->get();
    $to = \App\Stop::select('shortname')->whereIn('id',$toMarkers)->get();

    $xF = "";
    foreach($from as $fr) {
       $xf = $xf."'".$fr->shortname."',";
    }
    $xf = substr($xf,0,-1);
    $xt = "";
    foreach($to as $t) {
       $xt = $xt."'".$t->shortname."',";
    }
    $xt = substr($xt,0,-1);
    $config = [
        'host' => '127.0.0.1',
        'port' => '8123',
        'username' => 'default',
        'password' => 'kolomolo1234'
    ];
    $db = new ClickHouseDB\Client($config);
    $db->database('default');
    $db->setTimeout(1.5);      // 1500 ms
    $db->setTimeout(10);       // 10 seconds
    $db->setConnectTimeOut(5); // 5 seconds
    $suffix = 'AND toWeekDay(EventDate) IN (';
    if ($workingDays==true) {
        $suffix = $suffix.'0,1,2,3,4,';
    }
    if ($saturDay==true) {
        if (substr($string, -1)==",") { $suffix=$suffix."5,"; } else { $suffix=$suffix.",5,"; } 
    }
    if ($sunDay==true) {
        if (substr($string, -1)==",") { $suffix=$suffix."6"; } else { $suffix=$suffix.",6"; } 
    }

    $suffix = $suffix.')';
    if ((!$workingDays) && (!$saturDay) && (!$sunDay)) { $suffix = '';}
    $query = "SELECT toHour(EventDate) as rED, CONCAT(toString(toHour(EventDate)),':00-',toString(toHour(EventDate)+1),':00') as ED,count(*) as ile FROM default.journeys WHERE busstopTo IN [".$xt."] AND passingType='Pasażerska terminowa >> Wyjście' AND CardNumber IN (SELECT DISTINCT CardNumber as ile FROM default.journeys WHERE busstopFrom IN [".$xf."] AND passingType='Pasażerska terminowa >> Wejście' AND EventDate>'".$dateFrom."' AND EventDate<'".$dateTo."' ".$suffix.") AND EventDate>'".$dateFrom."' AND EventDate<'".$dateTo."' ".$suffix." GROUP BY (passingType,ED,rED) ORDER BY rED";
   
    $statement = $db->select($query);
    $params['pF'] = $polygonFromObject;
    $params['pT'] = $polygonToObject;
    return response()->json(['data'=>$statement->rows(),'params'=>$params]);
});