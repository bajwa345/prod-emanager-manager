export interface User
{
    id: string;
    username: string;
    name: string;
    email: string;
    mobile: string;
    whatsapp: string;
    cnic: string;
    signuptime: string;
    avatar?: string;
    candidateid?: number;
    candidate?: string;
    candidateeng?: string;
    candidatedetail?: string;
    candidatedetailarea?: string;
    party?: string;
    symbol?: string;
    level?: string;
    constituencyid?: number;
    constituency?: string;
    constituencyMapUrl: string;
    licensecode: string;
    licenseexpiry: string;
    status?: string;
}
