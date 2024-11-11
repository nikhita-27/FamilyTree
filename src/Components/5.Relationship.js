import React from "react";
import { useState } from "react";

const Relation=()=>{
    //initializing variable
    const[Relation,setRelation]=useState([]);
    const[Name,setName]=useState([]);


    const handleSubmit=(e)=>{
        //for avoiding default submit
        e.preventDefault();
    }
        
    const newRelation={
        //for adding new relation
        Relationship:[{type:Relation,Name}]
    };

    return(
        <form onSubmit={handleSubmit}>
            <label>
                Relation:<select value={Relation} onChange={(e)=>setRelation(e.target.value)} >
                    <option value="Mother">Mother</option>;
                    <option value="Father">Father</option>;
                    <option value="Me">Me</option>;
                    <option value="Sibling">Sibling</option>
                    <option value="Grandmother">Granny</option>;
                    <option value="Grandfather">Grandpa</option>;
                    </select>;
            </label>

            <button type='submit'>Add</button>
        </form>
    )
}

export  {Relation};