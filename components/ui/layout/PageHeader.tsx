interface Props {

    title:string;

    subtitle?:string;

}

export default function PageHeader({

title,

subtitle,

}:Props){

return(

<div>

<h1 className="text-2xl font-bold text-slate-900 md:text-4xl">

{title}

</h1>

{subtitle &&(

<p className="mt-2 text-sm text-slate-500 md:text-base">

{subtitle}

</p>

)}

</div>

);

}