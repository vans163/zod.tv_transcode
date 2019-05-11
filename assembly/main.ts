import "allocator/arena";
export { memory };

import { context, storage, collections, near } from "./near";
import { MJob } from "./model.near";

let jobMap: collections.Map<u64,MJob> = new collections.Map<u64,MJob>("job_map");

export function jobInsert(enc_json: string, enc_nonce: string): void {
    let next_job_id = storage.get<u64>("counter_job");
    storage.set<u64>("counter_job", next_job_id+1);

    let job = new MJob();
    job.id = next_job_id;
    job.block = context.blockIndex;
    job.owner = context.sender;
    job.job_enc_json = enc_json;
    job.job_enc_nonce = enc_nonce;
    job.drone = null;
    job.done = false;
    job.error_code = 0;
    job.error_text = null;

    jobMap.set(next_job_id, job);
}

export function jobDelete(id: u64): void {
    let job = jobMap.get(id);
    if (job == null) {
        near.log("Job by "+id.toString()+" does not exist.");
        return;
    }
    if (context.sender == context.contractName) {
        jobMap.delete(id);
    } else {
        if (job.owner != context.sender) {
            near.log("Job by "+id.toString()+" is not owned by you.");
            return;
        }
        //Job already running, dont delete it
        if (job.drone != null && job.drone != "") {
            near.log("Job by "+id.toString()+" is already started by "+job.drone+". Wait until completion or timeout before deleting.");
            return;
        }
        jobMap.delete(id);
    }
}

export function getMyJobs(): Array<MJob> {
    return jobMap.values();
}
export function getJobs(): Array<MJob> {
    return jobMap.values();
}
export function getJobsByAccount(account: string): Array<MJob> {
    return jobMap.values().filter(v => v.owner == account);
}
export function getJob(id: u64): MJob {
    return jobMap.get(id);
}

