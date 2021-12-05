<!-- First you need to extend the CB layout -->
@extends('crudbooster::admin_template')
@section('content')
<meta name="csrf-token" content="{{ csrf_token() }}">
<link rel='stylesheet' href='https://mobilitytracker.ml/style.css'/>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@tarekraafat/autocomplete.js@10.2.6/dist/css/autoComplete.min.css">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
   integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
   crossorigin=""/>
<link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.css'/>
   <!-- Make sure you put this AFTER Leaflet's CSS -->
  <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
   integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA=="
   crossorigin=""></script>  
   <script src='https://cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.js'></script>
   <script src='https://unpkg.com/micromodal/dist/micromodal.min.js'></script>
   <script src='https://mobilitytracker.ml/js/leaflet.migrationLayer.js'></script>
<style type='text/css'>
@if (CRUDBooster::myPrivilegeId()==2)
.main-sidebar {display:none;}
.sidebar-toggle { display:none;}
.sidebar-mini.sidebar-collapse .content-wrapper, .sidebar-mini.sidebar-collapse .right-side, .sidebar-mini.sidebar-collapse .main-footer { margin-left:0px !important;}
@endif
.content-header { display:none !important; }
.content { padding:0px !important; }
.modal { z-index:105000;}
.modal__btn { font-size:20px;} 
  #timeFrom { font-size:20px;}
  #timeTo { font-size:20px;}
  .formSelector { width:440px; font-size:20px;}
   
    #mapComponent { height:100px; }
 
    #filter { width: 100px; height:100px;}
</style>

<div id='mapComponent'>
<div style="z-index:99999; padding-left: 10px;padding-right: 10px; position:absolute; right: 0px; bottom:150px;">
<button type="button" style='' id="filter" onclick="editRoutes();" class="btnStyle span3">Szukaj</button>
<br/><br/>
<button type="button" style='' id="filter" onclick="showHideStops();" class="btnStyle span3">Pokaż/Ukryj przystanki</button>
        </div> 
</div>
<div class="modal micromodal-slide" id="modal-1" aria-hidden="true">
    <div class="modal__overlay" tabindex="-1" data-micromodal-close>
      <div class="modal__container" role="dialog" aria-modal="true" aria-labelledby="modal-1-title">
        <header class="modal__header">
          <h1 style='font-size:20px;' class="modal__title" id="modal-1-title">
            Wyszukiwanie:
          </h2>
          <button class="modal__close" aria-label="Close modal" data-micromodal-close></button>
        </header>
        <main class="modal__content" id="modal-1-content">
        <div>
            <input type="checkbox" id="onlyMine" name="onlyMine" checked>
            <label for="onlyMine">Pokaż tylko moje obszary</label>
          </div>
          <b><u>Obszar początkowy:</u></b><br/>
          <select id='polygonFrom' class='formSelector'>
          </select>
          <br/><br/>
          <b>Obszar końcowy:</b><br/>
          <select id='polygonTo' class='formSelector'>
          </select>
          <!--
          <br/><br/>
          <b>Godzina od:</b><br/>
          -->
          <input style='display:none;' id='timeFrom' type="time" step="900" value="00:00"> 
          <input style='display:none;' id='timeTo' type="time" step="900" value="23:59"> 
          
          <br/><br/>
          <b>Dni tygodnia:</b><br/>
          <div>
            <input type="checkbox" id="workingDays" name="workingDays" checked>
            <label for="workingDays">Poniedziałek - Piątek</label>
          </div>
          <div>
            <input type="checkbox" id="saturDay" name="saturDay" checked>
            <label for="saturDay">Sobota</label>
          </div>
          <div>
            <input type="checkbox" id="sunDay" name="sunDay" checked>
            <label for="sunday">Niedziela</label>
          </div>
          <br/>
          <b>Zakres dat: </b><br/>
          <input id='dateFrom' type="date" > <!-- 5 min step -->
          <input id='dateTo' type="date" > <!-- 5 min step -->
          <br/><br/>
       </main>
        <footer class="modal__footer">
          <button class="modal__btn modal__btn-primary" onclick="search();">Szukaj</button>
          <button class="modal__btn" data-micromodal-close aria-label="Zamknij to okno">Anuluj</button>
        </footer>
      </div>
    </div>
  </div>


@endsection