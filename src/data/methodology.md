# Methodology: NT Innovation Index

## Overview

The NT Innovation Index is a computational instrument that quantifies lexical, semantic, and conceptual departure from a Hebrew-rooted Greek baseline across all 27 New Testament books. The instrument treats the Masoretic Text (MT) as the anchor of the Hebrew semantic world, uses the Septuagint (LXX) as the Greek measurement baseline mediating that world, and scores each NT book along six weighted axes that compose a single Innovation Index score on a 0–100 scale. The project aims for academic objectivity: given the same data and scoring rubric, researchers with different theological commitments should arrive at identical or near-identical measurements.

## Corpus Provenance

The NT token data derive from the Society of Biblical Literature Greek New Testament (SBLGNT), producing 137,554 tokens and 5,447 unique lemmas across 27 books. LXX lemma inventories and MT-LXX alignment tables are drawn from the CATSS (Computer Assisted Tools for Septuagint Studies) parallel aligned text. A background Greek corpus of approximately 7.6 million tokens, compiled from 46 Koine and classical authors in the Perseus Digital Library XML and lemmatized via the Classical Language Toolkit (CLTK), was assembled to test collocational background frequency (see Limitations). The semantic shift lexicon — 579 rows, 503 non-zero entries — was constructed manually against LXX and NT core usage, with each entry recording a shift degree (0–3), shift type classification, and verse citations.

## Axis Definitions and Computation

The composite score is a weighted sum of six axes. Weights sum to 1.0 and were calibrated empirically to produce a minimum 30-point spread across the 27-book distribution.

### Axis 1: Inverse LXX Lexical Continuity (weight 0.15)

For each book, the proportion of its unique lemma types that also appear in the LXX lemma inventory is computed. This continuity value is then inverted (100 minus the percentage) so that higher scores indicate greater lexical departure from the LXX. This axis is fully automated and requires no interpretive judgment.

### Axis 2: Inverse MT Anchor (weight 0.15)

Using the CATSS MT-LXX alignment tables, each NT lemma is assigned a normalized MT anchor strength reflecting the degree to which its Greek form maps to attested Hebrew equivalents in the alignment data. The per-book mean anchor strength is then inverted so that higher scores reflect greater departure from Hebrew-rooted vocabulary. This axis is fully automated.

### Axis 3: Extra-LXX Dependence (weight 0.10)

This axis measures the proportion of a book's unique lemma types that are absent from the LXX inventory entirely, capturing vocabulary drawn from Koine or Hellenistic sources with no equivalent in the LXX Greek tradition. Computation is fully automated from the LXX lemma inventory.

### Axis 4: Semantic Refunctionalization (weight 0.10)

The 503-entry semantic shift lexicon assigns each scored lemma a degree of semantic shift on a 0–3 scale relative to its LXX core meaning, where 0 indicates no detectable shift, 1 indicates minor extension, 2 indicates significant refunction, and 3 indicates near-complete semantic displacement. The per-book score is the mean shift degree across all unique lemma types in the book that appear in the lexicon. Lemmas absent from the lexicon contribute 0 to the mean, which has the effect of diluting scores for larger books (see Limitations). This axis is classified as hybrid: the shift degrees were assigned through manual scholarly judgment and are therefore subject to reproducibility constraints described below.

### Axis 5: Collocational Innovation (weight 0.15)

A bigram inventory is extracted from the LXX as a collocational baseline. For each bigram attested in a given NT book, a novelty weight is assigned based on its absence or rarity in the LXX bigram database. The per-book score is the mean innovation weight across all bigrams in that book. Computation is algorithmic once the LXX collocational database is established.

### Axis 6: Conceptual Innovation (weight 0.35)

This axis is a composite of nine manually scored concept axes, each rated 0–3 with verse citations: keeper_obligation (sibling responsibility and care for the poor), kingdom_nonhierarchy (kingdom as status inversion), hierarchy_building (endorsement of hierarchical authority), domination_accommodation (accommodation to imperial or patron power structures), israel_continuity (continuity with Israel's covenant story), christological_recomposition (Jesus tradition recomposed toward cosmic or imperial Christology), orthodoxy_production (production of doctrinal boundaries and heresy categories), eschatological_deferral (transformation deferred to future or afterlife), and creation_ground (groundedness in physical creation and embodied life). Scores are averaged and scaled to 0–100. The 0.35 weight reflects the fact that this axis alone produces an 83-point sub-spread across the corpus (James: 0; 1 Timothy: 83.3), far exceeding any computed axis.

## Derived Composite Scores

Two derived composites are computed from subsets of the nine concept axes. **Institutional Consolidation** is the mean of hierarchy_building, domination_accommodation, orthodoxy_production, and eschatological_deferral, scaled to 0–100. **Covenantal Integrity** is the mean of keeper_obligation, kingdom_nonhierarchy, israel_continuity, and creation_ground, scaled to 0–100. These drive dominant innovation mode assignment via a priority rule-set: institutional_capture (consolidation ≥ 75), resistance_preservation (integrity ≥ 66 and consolidation ≤ 17), contested_recomposition (consolidation ≥ 41 and integrity ≥ 41), institutional_trajectory (consolidation ≥ 33 and integrity < 25), conceptual_recomposition (conceptual ≥ 50 and consolidation ≤ 17), dialectical_innovation (conceptual ≥ 33 and integrity ≥ 41), or moderate_synthesis as the default. The dominant contradiction field identifies the concept axis pair with the largest absolute gap per book.

## Profile Labels

Books are assigned profile labels from a six-tier schema calibrated to the empirical distribution: lxx_anchored (below 30), constrained_departure (30–38), selective_recomposition (38–44), composite_recomposition (44–50), institutional_innovation (50–57), and systemic_recomposition (57 and above). Thresholds are descriptive, not normative, and were fixed after observing the full 27-book distribution to ensure meaningful tier differentiation.

## Hermeneutical Position

This instrument was constructed from a specific interpretive tradition and cannot claim to be neutral. Three commitments are embedded in its design that researchers should evaluate before citing its outputs.

**First**, the choice of the MT-LXX tradition as a semantic baseline presupposes that departure from that tradition constitutes meaningful "innovation." A researcher working within a supersessionist framework — one that holds the NT to have fulfilled and therefore superseded the Hebrew tradition — would not describe the same textual features as innovation at all but as completion. The instrument treats distance from the Hebrew-Greek tradition as analytically significant; it does not adjudicate whether that distance represents progress, loss, or lateral development.

**Second**, the Covenantal Integrity composite (keeper_obligation, kingdom_nonhierarchy, israel_continuity, creation_ground) treats these four features as a coherent cluster worth measuring. This reflects a theological judgment that covenant obligations, non-hierarchical social vision, continuity with Israel's story, and material groundedness belong together as aspects of a single phenomenon. Researchers who do not share this clustering assumption — who might, for instance, view hierarchical ordering as compatible with or even required by covenant faithfulness — may wish to rescore the concept axes or restructure the composite.

**Third**, the Institutional Consolidation composite (hierarchy_building, domination_accommodation, orthodoxy_production, eschatological_deferral) groups structural development with imperial accommodation and deferred eschatology. This reflects a tradition that reads these features as functionally related. Researchers in the Weberian tradition of legitimate institutionalization, or in traditions that view doctrinal boundary-setting as necessary for preservation of the deposit of faith, may find this grouping tendentious. The instrument makes no claim that high Institutional Consolidation is bad; it claims only that it is measurable and that its distribution across the NT canon is uneven and interpretively significant.

In short: the instrument measures what it measures. The selection of what to measure, how to group it, and what to call the resulting composites reflects a position. That position is stated here so that the outputs can be evaluated accordingly.

## Known Limitations

Four limitations are acknowledged. First, large-book dilution affects semantic_refunctionalization: books with 2,000 or more unique lemma types (Luke, Acts) receive lower scores because the 503-entry lexicon covers a smaller fraction of their vocabulary. This is a known property of type-frequency averaging and is not corrected in the current version. Second, discrete stepping in capture and resistance composites: with only four integer-scored (0–3) axes per composite, possible values step at 8.33-point intervals, limiting granularity. Third, conceptual axis dominance: the 0.35 weight makes book rankings substantially sensitive to the nine manual concept scores, making citation-backed transparency for those scores critical to the instrument's validity. Fourth, PMI collocational background instability: replacing LXX-based collocational scoring with PMI over the Perseus background corpus showed 92% of NT bigrams absent from any attested Greek background corpus — confirming NT Greek's register distinctiveness but rendering PMI too insensitive to discriminate across books; the LXX bigram database is therefore retained.

## Reproducibility and Replication

Axes 1, 2, 3, and 5 are fully reproducible given the source data files (`data/raw/nt_tokens.csv`, `data/raw/lxx_lemmas.csv`, `data/raw/mt_lxx_alignment.csv`, `data/raw/lxx_collocations.csv`). Axis 4 requires `data/raw/semantic_shift_lexicon.csv`; replication of the lexicon itself requires scholarly judgment about shift degree assignments, and those entries should be treated as a scored resource subject to peer review rather than as raw data. Axis 6 requires `data/raw/concept_scores.csv`; every entry is accompanied by verse citations and a brief rationale. Independent scorers are invited to rescore any book using the rubric in `docs/scoring_rubric.md`. Final per-book outputs — all six axis scores, the composite Innovation Index, capture pressure, resistance residue, dominant innovation mode, profile label, and dominant contradiction — are archived in `data/processed/book_scores.csv` (27 books × 26 columns). The full pipeline is executable via `run_pipeline.py` and is version-controlled so that any changes to scoring logic remain traceable.
