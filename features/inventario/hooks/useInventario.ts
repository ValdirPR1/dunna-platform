"use client";

import {useEffect,useState} from "react";

import {listarInventario} from "../services/inventario.service";

export function useInventario(){

const[loading,setLoading]=useState(true);

const[imoveis,setImoveis]=useState<any[]>([]);

useEffect(()=>{

listarInventario()

.then(setImoveis)

.finally(()=>setLoading(false));

},[]);

return{

loading,

imoveis,

};

}