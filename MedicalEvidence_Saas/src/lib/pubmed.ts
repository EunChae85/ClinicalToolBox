export async function fetchPubMedData(pmid: string) {
    // Graceful handling for mock IDs
    if (pmid.startsWith('ev_ko')) {
        return {
            id: pmid,
            title: "국내 만성질환 관리 가이드라인의 효과 분석",
            abstract: "본 연구는 국내 만성질환 관리 가이드라인의 준수 여부가 환자의 임상적 결과에 미치는 영향을 분석하였다. 총 5,000명의 환자를 대상으로 12개월간 추적 관찰한 결과, 가이드라인을 철저히 준수한 군에서 당화혈색소 수치가 유의미하게 감소하였으며...",
            journal: "Korean Journal of Family Medicine",
            year: "2026",
        };
    }

    try {
        const url = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${pmid}&retmode=json`;
        const summaryResponse = await fetch(url);
        const summaryData = await summaryResponse.json();

        // Abstract fetch is separate
        const abstractUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${pmid}&rettype=abstract&retmode=text`;
        const abstractResponse = await fetch(abstractUrl);
        const abstractText = await abstractResponse.text();

        if (summaryData.result && summaryData.result[pmid]) {
            const item = summaryData.result[pmid];
            return {
                id: pmid,
                title: item.title,
                journal: item.source,
                year: item.pubdate,
                authors: item.authors?.map((a: any) => a.name).join(', ') || 'Unknown',
                abstract: abstractText || 'No abstract available.',
            };
        }
        return null;
    } catch (error) {
        console.error('PubMed Fetch Error:', error);
        return null;
    }
}
