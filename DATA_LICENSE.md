# Data / Corpus / Lore Rights

The MIT license in `LICENSE` applies only to source code.

It does not automatically grant rights to:

- transcript-derived Voice Evidence
- behavior profiles
- Signature Layer data
- Wiki / Lore pages
- entity and alias indexes derived from Wiki / Lore
- names, likenesses, quotes, screenshots, videos, or other source-derived materials

## Included Data

This repository may include derived data required for self-hosted runtime:

```text
data/behavior/
data/index/
data/lore/
data/corpus/seed_chunks.md
```

The runtime needs these files to answer Lore questions and preserve character voice behavior.

## Not Included By Default

Do not include raw videos or raw transcript research folders in a public release unless their rights and redistribution status are separately reviewed:

```text
raw source videos
data/corpus/raw_transcripts/
data/eval/source_validation/
```

## Wiki / Lore

The Lore pages are source-derived from Wenyaverse-related Wiki material and local user curation. Their rights may depend on the original Wiki/source license and contributor terms.

If you redistribute this project, preserve source notes and do not present fan-lore, fictional material, disputed material, or self-reported claims as verified real-world facts.

## Voice / Transcript-Derived Data

Voice evidence and behavior data are derived from publicly available video subtitle/transcript work. They are included for research, parody, and internet-culture preservation purposes. Redistribution may still require attention to platform terms, copyright, personality rights, and quotation limits in your jurisdiction.

## Practical Recommendation

For public GitHub release:

- include processed runtime data needed for self-hosted use;
- exclude raw videos and full raw transcript folders by default;
- keep this file with the repository;
- do not apply the code license to data unless you have separately cleared rights.
