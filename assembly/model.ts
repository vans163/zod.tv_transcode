export class MMetadataJob {
    width: number;
    height: number;
    fps: number;
    vid_in_codec: string;
    vid_out_codec: Array<string>;

    //constructor(params: MMetadataJob) {
    //    Object.assign(this, params)
    //}
}

export class MJob {
    id: i32;
    block: u64;
    owner: string;
    job_enc_json: string;
    job_enc_nonce: string;
    drone: string;
    done: boolean;
    error_code: i32;
    error_text: string;
}