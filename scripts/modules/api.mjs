import { MODULE } from "../module.mjs"

export class ApiFunctions{
    static deepSearch(){
        function search(collection,problematicCollections){
            if (collection.invalidDocumentIds.size!==0){
                problematicCollections.push(collection)
            }
            for (const embeddedCollectionName of Object.values(collection.documentClass.implementation.metadata.embedded)){
                for (const document of collection){
                    const embeddedCollection=document[embeddedCollectionName]
                    if (embeddedCollection?.documentName==="ActorDelta"){//singleton Collection returns the Document directly so our "Collection" is actually a Document. This will error if more get added though
                        const delta=document.delta
                        if (delta===null){
                            if (!game.actors.map(i=>i.id).contains(document.actorId)) continue // if token has no actor skip it
                        } 
                        for (const embeddedActorDocName of Object.values(Actor.implementation.metadata.embedded)){
                            search(delta[embeddedActorDocName],problematicCollections)
                        }
                    }
                    else{
                        search(embeddedCollection,problematicCollections)
                    }
                }
            }
        }
    
    
        let affectedCollections=[]
    
    
        for (const topLevelCollection of game.collections){
            search(topLevelCollection,affectedCollections)
        }
        // keeping the below for the future, will need to add a confirmation dialogue before adding an option to run it
        //uncomment to include packs, doesn't change anything in my testing but freezes and potentially crashes the client if insufficient RAM is present.
        /* 
        for (const pack of game.packs){
            await pack.getDocuments()
            search(pack,toBeFixed)
        }
        */
        return affectedCollections
    }
    static register(){
        game.modules.get(MODULE.id).api.deepSearch=ApiFunctions.deepSearch
    }
}