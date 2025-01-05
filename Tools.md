# Tools
Tools are the building blocks of the platform. They are used to perform one time specific transactions with the onchain protocols. Tools are built using the parameters as input and execution calldata as output. Tools have the following structure: 
- Input: {`id`, `params`}
- Function: {
    - Call data api's for constructing protocol fuctions based on `params`
    - Constructing the final batched calldata for all actions 
}
- Output: {`calldata`}
All the tools are organised into `Templates` so they have definitions that enable them to called either via API or directly as tool by Agent. 

