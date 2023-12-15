import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Popup, CircleMarker, LayersControl } from 'react-leaflet';
import ReactLeafletGoogleLayer from 'react-leaflet-google-layer';
import 'leaflet/dist/leaflet.css';
import 'flowbite/dist/flowbite.css';
import Header from './Components/Header';
const center = {
  lat: -3.7491200,
  lng: -73.2538300,
};

const Fecha3 = () => {
  const googleApiKey = "AIzaSyA68xOsLic_QKxD4EcnwZDrtv-iE09-95M";
  const mapStyles = {
    Aubergine: require("./Stylemaps/aubergine-map-style.json"),
    Dark: require("./Stylemaps/dark-map-style.json"),
    Retro: require("./Stylemaps/retro-map-style.json"),
    Night: require("./Stylemaps/night-map-style.json"),
    Estandar: require("./Stylemaps/standard-map-style.json"),
  };

  const [selectedStyle, setSelectedStyle] = useState("Aubergine");
  const [markers, setMarkers] = useState([]);
  const [heatMapData, setHeatMapData] = useState([]);
  const [filteredParIntId, setFilteredParIntId] = useState("all");
  const [filteredMarkers, setFilteredMarkers] = useState([]);
  const [colorMap, setColorMap] = useState({});
  const [selectedColor, setSelectedColor] = useState(null);

  // Sample data to be added as markers
  const markerData = [{ id_parametro:	2	,	temperatura:	28.50	,	lng:	-73.2524834	,	lat:	-3.7590387	,	status:	"A"	,	date:"	2023-11-14 02:02:32		"},
    { id_parametro:	2	,	temperatura:	28.50	,	lng:	-73.2855221	,	lat:	-3.7833564	,	status:	"A"	,	date:"	2023-11-14 04:31:15		"},
    { id_parametro:	2	,	temperatura:	28.90	,	lng:	-73.2670459	,	lat:	-3.7740564	,	status:	"A"	,	date:"	2023-11-14 04:35:07		"},
    { id_parametro:	2	,	temperatura:	29.10	,	lng:	-73.2530096	,	lat:	-3.760533	,	status:	"A"	,	date:"	2023-11-14 04:39:49		"},
    { id_parametro:	2	,	temperatura:	26.70	,	lng:	-73.2532866	,	lat:	-3.7474502	,	status:	"A"	,	date:"	2023-11-14 23:54:23		"},
    { id_parametro:	2	,	temperatura:	29.80	,	lng:	-73.2468775	,	lat:	-3.7573762	,	status:	"A"	,	date:"	2023-11-14 01:56:09		"},
    { id_parametro:	2	,	temperatura:	29.80	,	lng:	-73.2479748	,	lat:	-3.756791	,	status:	"A"	,	date:"	2023-11-14 01:58:40		"},
    { id_parametro:	2	,	temperatura:	28.50	,	lng:	-73.2537666	,	lat:	-3.7610887	,	status:	"A"	,	date:"	2023-11-14 02:03:31		"},
    { id_parametro:	2	,	temperatura:	28.50	,	lng:	-73.2824087	,	lat:	-3.7814077	,	status:	"A"	,	date:"	2023-11-14 04:32:16		"},
    { id_parametro:	2	,	temperatura:	29.30	,	lng:	-73.2581934	,	lat:	-3.7660613	,	status:	"A"	,	date:"	2023-11-14 04:37:58		"},
    { id_parametro:	2	,	temperatura:	29.80	,	lng:	-73.247563	,	lat:	-3.7570838	,	status:	"A"	,	date:"	2023-11-14 01:57:09		"},
    { id_parametro:	2	,	temperatura:	29.30	,	lng:	-73.2491501	,	lat:	-3.756279	,	status:	"A"	,	date:"	2023-11-14 01:59:40		"},
    { id_parametro:	2	,	temperatura:	28.50	,	lng:	-73.2558535	,	lat:	-3.7646216	,	status:	"A"	,	date:"	2023-11-14 02:04:32		"},
    { id_parametro:	2	,	temperatura:	28.50	,	lng:	-73.2767743	,	lat:	-3.7780716	,	status:	"A"	,	date:"	2023-11-14 04:33:16		"},
    { id_parametro:	2	,	temperatura:	28.90	,	lng:	-73.2645345	,	lat:	-3.771735	,	status:	"A"	,	date:"	2023-11-14 04:36:07		"},
    { id_parametro:	2	,	temperatura:	29.30	,	lng:	-73.250007	,	lat:	-3.7570137	,	status:	"A"	,	date:"	2023-11-14 04:40:49		"},
    { id_parametro:	2	,	temperatura:	28.90	,	lng:	-73.2504849	,	lat:	-3.7577096	,	status:	"A"	,	date:"	2023-11-14 02:00:39		"},
    { id_parametro:	2	,	temperatura:	28.50	,	lng:	-73.2572417	,	lat:	-3.7649152	,	status:	"A"	,	date:"	2023-11-14 02:05:32		"},
    { id_parametro:	2	,	temperatura:	28.50	,	lng:	-73.2703462	,	lat:	-3.7761671	,	status:	"A"	,	date:"	2023-11-14 04:34:18		"},
    { id_parametro:	2	,	temperatura:	29.30	,	lng:	-73.2549678	,	lat:	-3.7627418	,	status:	"A"	,	date:"	2023-11-14 04:38:59		"},
    { id_parametro:	2	,	temperatura:	28.90	,	lng:	-73.2520824	,	lat:	-3.7589445	,	status:	"A"	,	date:"	2023-11-14 02:01:41		"},
    { id_parametro:	2	,	temperatura:	28.90	,	lng:	-73.2580582	,	lat:	-3.7647929	,	status:	"A"	,	date:"	2023-11-14 02:06:33		"},
    { id_parametro:	2	,	temperatura:	28.90	,	lng:	-73.2606039	,	lat:	-3.7678277	,	status:	"A"	,	date:"	2023-11-14 04:37:07		"},
    { id_parametro:	2	,	temperatura:	28.50	,	lng:	-73.2521894	,	lat:	-3.7590218	,	status:	"A"	,	date:"	2023-11-14 02:02:42		"},
    { id_parametro:	2	,	temperatura:	28.50	,	lng:	-73.2849103	,	lat:	-3.7827727	,	status:	"A"	,	date:"	2023-11-14 04:31:25		"},
    { id_parametro:	2	,	temperatura:	28.90	,	lng:	-73.2662164	,	lat:	-3.773689	,	status:	"A"	,	date:"	2023-11-14 04:35:17		"},
    { id_parametro:	2	,	temperatura:	29.30	,	lng:	-73.2526563	,	lat:	-3.7594624	,	status:	"A"	,	date:"	2023-11-14 04:39:59		"},
    { id_parametro:	2	,	temperatura:	29.80	,	lng:	-73.2468792	,	lat:	-3.7573881	,	status:	"A"	,	date:"	2023-11-14 01:56:19		"},
    { id_parametro:	2	,	temperatura:	29.80	,	lng:	-73.2481022	,	lat:	-3.756681	,	status:	"A"	,	date:"	2023-11-14 01:58:50		"},
    { id_parametro:	2	,	temperatura:	28.50	,	lng:	-73.2541286	,	lat:	-3.7616052	,	status:	"A"	,	date:"	2023-11-14 02:03:42		"},
    { id_parametro:	2	,	temperatura:	28.50	,	lng:	-73.2822463	,	lat:	-3.7813267	,	status:	"A"	,	date:"	2023-11-14 04:32:26		"},
    { id_parametro:	2	,	temperatura:	29.30	,	lng:	-73.2580277	,	lat:	-3.7657426	,	status:	"A"	,	date:"	2023-11-14 04:38:08		"},
    { id_parametro:	2	,	temperatura:	29.80	,	lng:	-73.2474697	,	lat:	-3.7571081	,	status:	"A"	,	date:"	2023-11-14 01:57:20		"},
    { id_parametro:	2	,	temperatura:	29.30	,	lng:	-73.2493121	,	lat:	-3.7561654	,	status:	"A"	,	date:"	2023-11-14 01:59:50		"},
    { id_parametro:	2	,	temperatura:	28.50	,	lng:	-73.2566926	,	lat:	-3.7650928	,	status:	"A"	,	date:"	2023-11-14 02:04:42		"},
    { id_parametro:	2	,	temperatura:	28.50	,	lng:	-73.2749369	,	lat:	-3.7770366	,	status:	"A"	,	date:"	2023-11-14 04:33:26		"},
    { id_parametro:	2	,	temperatura:	28.90	,	lng:	-73.263392	,	lat:	-3.7709611	,	status:	"A"	,	date:"	2023-11-14 04:36:17		"},
    { id_parametro:	2	,	temperatura:	29.30	,	lng:	-73.2500721	,	lat:	-3.7558012	,	status:	"A"	,	date:"	2023-11-14 04:42:55		"},
    { id_parametro:	2	,	temperatura:	28.90	,	lng:	-73.2509919	,	lat:	-3.7585432	,	status:	"A"	,	date:"	2023-11-14 02:00:50		"},
    { id_parametro:	2	,	temperatura:	28.50	,	lng:	-73.2575004	,	lat:	-3.7647655	,	status:	"A"	,	date:"	2023-11-14 02:05:42		"},
    { id_parametro:	2	,	temperatura:	28.50	,	lng:	-73.2699054	,	lat:	-3.7756782	,	status:	"A"	,	date:"	2023-11-14 04:34:27		"},
    { id_parametro:	2	,	temperatura:	29.30	,	lng:	-73.2542408	,	lat:	-3.7616132	,	status:	"A"	,	date:"	2023-11-14 04:39:10		"},
    { id_parametro:	2	,	temperatura:	28.50	,	lng:	-73.2523319	,	lat:	-3.7588225	,	status:	"A"	,	date:"	2023-11-14 02:01:51		"},
    { id_parametro:	2	,	temperatura:	28.90	,	lng:	-73.2586307	,	lat:	-3.7650927	,	status:	"A"	,	date:"	2023-11-14 02:06:42		"},
    { id_parametro:	2	,	temperatura:	28.90	,	lng:	-73.2600677	,	lat:	-3.7671492	,	status:	"A"	,	date:"	2023-11-14 04:37:20		"},
    { id_parametro:	2	,	temperatura:	26.70	,	lng:	-73.2533241	,	lat:	-3.7474356	,	status:	"A"	,	date:"	2023-11-14 23:54:25		"},
    { id_parametro:	2	,	temperatura:	28.50	,	lng:	-73.2529072	,	lat:	-3.7565126	,	status:	"A"	,	date:"	2023-11-14 02:02:52		"},
    { id_parametro:	2	,	temperatura:	28.50	,	lng:	-73.2848006	,	lat:	-3.7826683	,	status:	"A"	,	date:"	2023-11-14 04:31:34		"},
    { id_parametro:	2	,	temperatura:	28.90	,	lng:	-73.2660193	,	lat:	-3.7736405	,	status:	"A"	,	date:"	2023-11-14 04:35:27		"},
    { id_parametro:	2	,	temperatura:	29.30	,	lng:	-73.2525099	,	lat:	-3.759333	,	status:	"A"	,	date:"	2023-11-14 04:40:11		"},
    { id_parametro:	2	,	temperatura:	29.80	,	lng:	-73.2468909	,	lat:	-3.7574632	,	status:	"A"	,	date:"	2023-11-14 01:56:29		"},
    { id_parametro:	2	,	temperatura:	29.80	,	lng:	-73.2479892	,	lat:	-3.7566985	,	status:	"A"	,	date:"	2023-11-14 01:59:00		"},
    { id_parametro:	2	,	temperatura:	28.50	,	lng:	-73.2552555	,	lat:	-3.7630135	,	status:	"A"	,	date:"	2023-11-14 02:03:52		"},
    { id_parametro:	2	,	temperatura:	28.50	,	lng:	-73.2800883	,	lat:	-3.7805167	,	status:	"A"	,	date:"	2023-11-14 04:32:36		"},
    { id_parametro:	2	,	temperatura:	29.30	,	lng:	-73.2570988	,	lat:	-3.7654457	,	status:	"A"	,	date:"	2023-11-14 04:38:18		"},
    { id_parametro:	2	,	temperatura:	29.80	,	lng:	-73.2477294	,	lat:	-3.7568433	,	status:	"A"	,	date:"	2023-11-14 01:57:30		"},
    { id_parametro:	2	,	temperatura:	29.30	,	lng:	-73.2497339	,	lat:	-3.7565199	,	status:	"A"	,	date:"	2023-11-14 02:00:01		"},
    { id_parametro:	2	,	temperatura:	28.50	,	lng:	-73.2568371	,	lat:	-3.764971	,	status:	"A"	,	date:"	2023-11-14 02:04:52		"},
    { id_parametro:	2	,	temperatura:	28.50	,	lng:	-73.2742624	,	lat:	-3.7768512	,	status:	"A"	,	date:"	2023-11-14 04:33:36		"},
    { id_parametro:	2	,	temperatura:	28.90	,	lng:	-73.2624981	,	lat:	-3.7698909	,	status:	"A"	,	date:"	2023-11-14 04:36:27		"},
    { id_parametro:	2	,	temperatura:	28.90	,	lng:	-73.2513339	,	lat:	-3.759012	,	status:	"A"	,	date:"	2023-11-14 02:01:01		"},
    { id_parametro:	2	,	temperatura:	28.50	,	lng:	-73.257803	,	lat:	-3.764676	,	status:	"A"	,	date:"	2023-11-14 02:05:52		"},
    { id_parametro:	2	,	temperatura:	28.50	,	lng:	-73.269534	,	lat:	-3.7756157	,	status:	"A"	,	date:"	2023-11-14 04:34:36		"},
    { id_parametro:	2	,	temperatura:	29.30	,	lng:	-73.254146	,	lat:	-3.7615787	,	status:	"A"	,	date:"	2023-11-14 04:39:18		"},
    { id_parametro:	2	,	temperatura:	28.50	,	lng:	-73.2524327	,	lat:	-3.7586828	,	status:	"A"	,	date:"	2023-11-14 02:02:01		"},
    { id_parametro:	2	,	temperatura:	28.90	,	lng:	-73.2586506	,	lat:	-3.7651148	,	status:	"A"	,	date:"	2023-11-14 02:06:49		"},
    { id_parametro:	2	,	temperatura:	28.90	,	lng:	-73.2600476	,	lat:	-3.767095	,	status:	"A"	,	date:"	2023-11-14 04:37:27		"},
    { id_parametro:	2	,	temperatura:	28.50	,	lng:	-73.2532989	,	lat:	-3.7600163	,	status:	"A"	,	date:"	2023-11-14 02:03:02		"},
    { id_parametro:	2	,	temperatura:	28.50	,	lng:	-73.2837897	,	lat:	-3.7821852	,	status:	"A"	,	date:"	2023-11-14 04:31:45		"},
    { id_parametro:	2	,	temperatura:	28.90	,	lng:	-73.2660269	,	lat:	-3.7732129	,	status:	"A"	,	date:"	2023-11-14 04:35:37		"},
    { id_parametro:	2	,	temperatura:	29.30	,	lng:	-73.2516356	,	lat:	-3.7583874	,	status:	"A"	,	date:"	2023-11-14 04:40:19		"},
    { id_parametro:	2	,	temperatura:	29.80	,	lng:	-73.2469875	,	lat:	-3.7573544	,	status:	"A"	,	date:"	2023-11-14 01:56:39		"},
    { id_parametro:	2	,	temperatura:	29.80	,	lng:	-73.2485131	,	lat:	-3.756501	,	status:	"A"	,	date:"	2023-11-14 01:59:10		"},
    { id_parametro:	2	,	temperatura:	28.50	,	lng:	-73.2553416	,	lat:	-3.7635228	,	status:	"A"	,	date:"	2023-11-14 02:04:02		"},
    { id_parametro:	2	,	temperatura:	28.50	,	lng:	-73.278025	,	lat:	-3.77858	,	status:	"A"	,	date:"	2023-11-14 04:32:47		"},
    { id_parametro:	2	,	temperatura:	29.30	,	lng:	-73.2562144	,	lat:	-3.7648923	,	status:	"A"	,	date:"	2023-11-14 04:38:28		"},
    { id_parametro:	2	,	temperatura:	26.70	,	lng:	-73.2533282	,	lat:	-3.747434	,	status:	"A"	,	date:"	2023-11-14 23:54:35		"},
    { id_parametro:	2	,	temperatura:	29.80	,	lng:	-73.2477573	,	lat:	-3.7568051	,	status:	"A"	,	date:"	2023-11-14 01:57:40		"},
    { id_parametro:	2	,	temperatura:	29.30	,	lng:	-73.2498192	,	lat:	-3.7566171	,	status:	"A"	,	date:"	2023-11-14 02:00:10		"},
    { id_parametro:	2	,	temperatura:	28.50	,	lng:	-73.2569399	,	lat:	-3.7649765	,	status:	"A"	,	date:"	2023-11-14 02:05:02		"},
    { id_parametro:	2	,	temperatura:	28.50	,	lng:	-73.2730243	,	lat:	-3.7765327	,	status:	"A"	,	date:"	2023-11-14 04:33:46		"},
    { id_parametro:	2	,	temperatura:	28.90	,	lng:	-73.2621805	,	lat:	-3.7695186	,	status:	"A"	,	date:"	2023-11-14 04:36:37		"},
    { id_parametro:	2	,	temperatura:	28.90	,	lng:	-73.2514496	,	lat:	-3.7591668	,	status:	"A"	,	date:"	2023-11-14 02:01:10		"},
    { id_parametro:	2	,	temperatura:	28.50	,	lng:	-73.2579404	,	lat:	-3.7647619	,	status:	"A"	,	date:"	2023-11-14 02:06:02		"},
    { id_parametro:	2	,	temperatura:	28.50	,	lng:	-73.2694638	,	lat:	-3.7755654	,	status:	"A"	,	date:"	2023-11-14 04:34:47		"},
    { id_parametro:	2	,	temperatura:	29.30	,	lng:	-73.253373	,	lat:	-3.7608909	,	status:	"A"	,	date:"	2023-11-14 04:39:29		"},
    { id_parametro:	2	,	temperatura:	29.30	,	lng:	-73.2468746	,	lat:	-3.7574102	,	status:	"A"	,	date:"	2023-11-14 04:42:56		"},
    { id_parametro:	2	,	temperatura:	28.50	,	lng:	-73.2522846	,	lat:	-3.7586901	,	status:	"A"	,	date:"	2023-11-14 02:02:11		"},
    { id_parametro:	2	,	temperatura:	28.00	,	lng:	-73.2859089	,	lat:	-3.7837689	,	status:	"A"	,	date:"	2023-11-14 04:30:55		"},
    { id_parametro:	2	,	temperatura:	28.90	,	lng:	-73.2591786	,	lat:	-3.7664519	,	status:	"A"	,	date:"	2023-11-14 04:37:37		"},
    { id_parametro:	2	,	temperatura:	29.30	,	lng:	-73.2468746	,	lat:	-3.7574102	,	status:	"A"	,	date:"	2023-11-14 04:42:56		"},
    { id_parametro:	2	,	temperatura:	28.60	,	lng:	-73.2534656	,	lat:	-3.7603817	,	status:	"A"	,	date:"	2023-11-14 02:03:12		"},
    { id_parametro:	2	,	temperatura:	28.50	,	lng:	-73.2828273	,	lat:	-3.7815611	,	status:	"A"	,	date:"	2023-11-14 04:31:56		"},
    { id_parametro:	2	,	temperatura:	28.90	,	lng:	-73.265	,	lat:	-3.7722462	,	status:	"A"	,	date:"	2023-11-14 04:35:47		"},
    { id_parametro:	2	,	temperatura:	29.30	,	lng:	-73.2511215	,	lat:	-3.7582394	,	status:	"A"	,	date:"	2023-11-14 04:40:29		"},
    { id_parametro:	2	,	temperatura:	29.30	,	lng:	-73.2468746	,	lat:	-3.7574102	,	status:	"A"	,	date:"	2023-11-14 04:42:56		"},
    { id_parametro:	2	,	temperatura:	29.80	,	lng:	-73.2468815	,	lat:	-3.7573961	,	status:	"A"	,	date:"	2023-11-14 01:56:49		"},
    { id_parametro:	2	,	temperatura:	29.80	,	lng:	-73.248843	,	lat:	-3.7563755	,	status:	"A"	,	date:"	2023-11-14 01:59:20		"},
    { id_parametro:	2	,	temperatura:	28.50	,	lng:	-73.2554184	,	lat:	-3.763877	,	status:	"A"	,	date:"	2023-11-14 02:04:12		"},
    { id_parametro:	2	,	temperatura:	28.50	,	lng:	-73.2768697	,	lat:	-3.7782645	,	status:	"A"	,	date:"	2023-11-14 04:32:57		"},
    { id_parametro:	2	,	temperatura:	29.30	,	lng:	-73.2556974	,	lat:	-3.7641177	,	status:	"A"	,	date:"	2023-11-14 04:38:39		"},
    { id_parametro:	2	,	temperatura:	29.30	,	lng:	-73.2468746	,	lat:	-3.7574102	,	status:	"A"	,	date:"	2023-11-14 04:42:56		"},
    { id_parametro:	2	,	temperatura:	29.80	,	lng:	-73.2477601	,	lat:	-3.7568272	,	status:	"A"	,	date:"	2023-11-14 01:57:50		"},
    { id_parametro:	2	,	temperatura:	29.30	,	lng:	-73.2500186	,	lat:	-3.7568036	,	status:	"A"	,	date:"	2023-11-14 02:00:19		"},
    { id_parametro:	2	,	temperatura:	28.50	,	lng:	-73.2569428	,	lat:	-3.7649984	,	status:	"A"	,	date:"	2023-11-14 02:05:12		"},
    { id_parametro:	2	,	temperatura:	28.50	,	lng:	-73.2721425	,	lat:	-3.7768484	,	status:	"A"	,	date:"	2023-11-14 04:33:56		"},
    { id_parametro:	2	,	temperatura:	28.90	,	lng:	-73.2615835	,	lat:	-3.7688811	,	status:	"A"	,	date:"	2023-11-14 04:36:48		"},
    { id_parametro:	2	,	temperatura:	29.30	,	lng:	-73.2468746	,	lat:	-3.7574102	,	status:	"A"	,	date:"	2023-11-14 04:42:56		"},
    { id_parametro:	2	,	temperatura:	28.90	,	lng:	-73.2514078	,	lat:	-3.7590954	,	status:	"A"	,	date:"	2023-11-14 02:01:19		"},
    { id_parametro:	2	,	temperatura:	28.80	,	lng:	-73.2579583	,	lat:	-3.7647652	,	status:	"A"	,	date:"	2023-11-14 02:06:13		"},
    { id_parametro:	2	,	temperatura:	28.50	,	lng:	-73.2682174	,	lat:	-3.7748228	,	status:	"A"	,	date:"	2023-11-14 04:34:57		"},
    { id_parametro:	2	,	temperatura:	29.30	,	lng:	-73.253431	,	lat:	-3.7607444	,	status:	"A"	,	date:"	2023-11-14 04:39:40		"},
    { id_parametro:	2	,	temperatura:	29.30	,	lng:	-73.2468746	,	lat:	-3.7574102	,	status:	"A"	,	date:"	2023-11-14 04:42:56		"},
    { id_parametro:	2	,	temperatura:	28.50	,	lng:	-73.2522075	,	lat:	-3.7586946	,	status:	"A"	,	date:"	2023-11-14 02:02:22		"},
    { id_parametro:	2	,	temperatura:	28.30	,	lng:	-73.2856109	,	lat:	-3.7835299	,	status:	"A"	,	date:"	2023-11-14 04:31:05		"},
    { id_parametro:	2	,	temperatura:	29.00	,	lng:	-73.2584532	,	lat:	-3.7660762	,	status:	"A"	,	date:"	2023-11-14 04:37:47		"},
    { id_parametro:	2	,	temperatura:	29.30	,	lng:	-73.2468746	,	lat:	-3.7574102	,	status:	"A"	,	date:"	2023-11-14 04:42:56		"},
    { id_parametro:	2	,	temperatura:	29.80	,	lng:	-73.2478967	,	lat:	-3.7568517	,	status:	"A"	,	date:"	2023-11-14 01:58:32		"},
    { id_parametro:	2	,	temperatura:	28.70	,	lng:	-73.2535006	,	lat:	-3.7604383	,	status:	"A"	,	date:"	2023-11-14 02:03:21		"},
    { id_parametro:	2	,	temperatura:	28.50	,	lng:	-73.2827501	,	lat:	-3.7815168	,	status:	"A"	,	date:"	2023-11-14 04:32:05		"},
    { id_parametro:	2	,	temperatura:	28.90	,	lng:	-73.2650613	,	lat:	-3.7719158	,	status:	"A"	,	date:"	2023-11-14 04:35:58		"},
    { id_parametro:	2	,	temperatura:	29.30	,	lng:	-73.2504403	,	lat:	-3.757928	,	status:	"A"	,	date:"	2023-11-14 04:40:39		"},
    { id_parametro:	2	,	temperatura:	29.30	,	lng:	-73.2468746	,	lat:	-3.7574102	,	status:	"A"	,	date:"	2023-11-14 04:42:56		"},
    { id_parametro:	2	,	temperatura:	29.80	,	lng:	-73.2473843	,	lat:	-3.7571134	,	status:	"A"	,	date:"	2023-11-14 01:56:59		"},
    { id_parametro:	2	,	temperatura:	29.40	,	lng:	-73.2488529	,	lat:	-3.7563762	,	status:	"A"	,	date:"	2023-11-14 01:59:29		"},
    { id_parametro:	2	,	temperatura:	28.50	,	lng:	-73.2556857	,	lat:	-3.7642872	,	status:	"A"	,	date:"	2023-11-14 02:04:22		"},
    { id_parametro:	2	,	temperatura:	28.50	,	lng:	-73.2769644	,	lat:	-3.7781205	,	status:	"A"	,	date:"	2023-11-14 04:33:07		"},
    { id_parametro:	2	,	temperatura:	29.30	,	lng:	-73.2561595	,	lat:	-3.7640109	,	status:	"A"	,	date:"	2023-11-14 04:38:49		"},
    { id_parametro:	2	,	temperatura:	26.70	,	lng:	-73.2532883	,	lat:	-3.7474436	,	status:	"A"	,	date:"	2023-11-14 23:54:23		"},
    { id_parametro:	2	,	temperatura:	29.30	,	lng:	-73.2503953	,	lat:	-3.7575452	,	status:	"A"	,	date:"	2023-11-14 02:00:31		"},
    { id_parametro:	2	,	temperatura:	28.50	,	lng:	-73.2570667	,	lat:	-3.7649706	,	status:	"A"	,	date:"	2023-11-14 02:05:22		"},
    { id_parametro:	2	,	temperatura:	28.50	,	lng:	-73.2705298	,	lat:	-3.7766027	,	status:	"A"	,	date:"	2023-11-14 04:34:07		"},
    { id_parametro:	2	,	temperatura:	28.90	,	lng:	-73.2609132	,	lat:	-3.7684098	,	status:	"A"	,	date:"	2023-11-14 04:36:58		"},
    { id_parametro:	2	,	temperatura:	26.70	,	lng:	-73.2532866	,	lat:	-3.7474502	,	status:	"A"	,	date:"	2023-11-14 23:54:23		"},
    { id_parametro:	2	,	temperatura:	28.90	,	lng:	-73.2518624	,	lat:	-3.7589928	,	status:	"A"	,	date:"	2023-11-14 02:01:31		"},
    { id_parametro:	2	,	temperatura:	28.90	,	lng:	-73.2580528	,	lat:	-3.7647915	,	status:	"A"	,	date:"	2023-11-14 02:06:22		"},
    
  ];

  // Función para asignar el color según la temperatura
  const getColorByTemperature = (temperature) => {

    if (temperature >= 20 && temperature <= 30) {
      return 'blue';
    } else if(temperature >= 30 && temperature <= 33){
      return 'yellow';
    }
    else if (temperature >= 34 && temperature <= 37) {
      return 'lime'; // Verde fosforescente
    } else if (temperature >= 38 && temperature <= 39) {
      return 'pink';
    } else if (temperature >= 40) {
      return 'red';
    } else {
      return 'red'; // Puedes cambiar esto según tus necesidades para temperaturas fuera de los rangos especificados
    }
  };

  return (
    <><Header />
      <MapContainer center={center} zoom={13} style={{ height: '100vh' }}>
        <LayersControl position="topright">
          {Object.keys(mapStyles).map(style => (
            <LayersControl.BaseLayer
              key={style}
              checked={style === selectedStyle}
              name={style + ' Map'}
            >
              <ReactLeafletGoogleLayer apiKey={googleApiKey} type="roadmap" styles={mapStyles[style]} />
            </LayersControl.BaseLayer>
          ))}
        </LayersControl>

        {/* Add CircleMarkers for each data point */}
        {markerData.map(marker => (
          <CircleMarker
            key={marker.id}
            center={[marker.lat, marker.lng]}
            radius={8}
            color={getColorByTemperature(marker.temperatura)}
            fillColor={getColorByTemperature(marker.temperatura)}
            fillOpacity={3}
            weight={0}
          >
            {/* Add any additional content or popups here */}
            <Popup>{`Parametro: ${marker.id_parametro}, Temperatura: ${marker.temperatura}, Latitud:${marker.lat}, Longitud:${marker.lng}, Fecha: ${marker.date}`}</Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </>
  );
};

export default Fecha3;
