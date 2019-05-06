import "allocator/arena";
export { memory };

import { context, storage, collections, near } from "./near";
import { MJob } from "./model.near";

let jobMap: collections.Map<u64,MJob> = new collections.Map<u64,MJob>("job_map");

export function jobInsert(enc_json: string): void {
    let next_job_id = storage.get<u64>("counter_job");
    storage.set<u64>("counter_job", next_job_id+1);

    let job = new MJob();
    job.id = next_job_id;
    job.block = context.blockIndex;
    job.owner = context.sender;
    job.job_enc_json = enc_json;
    job.started_by = null;
    job.error_code = 0;
    job.error_text = null;

    jobMap.set(next_job_id, job);
}

export function jobDelete(id: u64): void {
    let job = jobMap.get(id);
    if (job == null || job.owner != context.sender) {
        return;
    }
    //Job already running, dont delete it
    if (job.started_by != null) {
        return;
    }
    jobMap.delete(id);
}

export function getMyJobs(): Array<MJob> {
    return jobMap.values();
}
export function getJobs(): Array<MJob> {
    return jobMap.values();
}
export function getJob(id: u64): MJob {
    return jobMap.get(id);
}

